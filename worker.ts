export interface Env {
  JWT_PUBLIC_KEY: string;
  ROUTES: string;
}

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Proteção contra loops: Worker mapeado apenas em /apps/*
    if (!url.pathname.startsWith('/apps/')) {
      return new Response('Not Found', { status: 404 });
    }

    const pathSegments = url.pathname.split('/');
    const projectSlug = pathSegments[2];

    if (!projectSlug) {
      return new Response('Slug do projeto inválido', { status: 400 });
    }

    // 1. Validação criptográfica real de JWT na borda
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response('Não autorizado: Token ausente', { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    const isValidToken = await verifyEdgeJWTSecure(token, env.JWT_PUBLIC_KEY);
    if (!isValidToken) {
      return new Response('Não autorizado: Assinatura ou expiração inválida', { status: 401 });
    }

    // 2. Resolução do destino via env.ROUTES
    let targetDomain = `${projectSlug}.koyeb.app`;
    try {
      if (env.ROUTES) {
        const customRoutes = JSON.parse(env.ROUTES);
        if (customRoutes[projectSlug]) {
          targetDomain = customRoutes[projectSlug];
        }
      }
    } catch (e) {
      // fallback seguro: continua com o domínio padrão
    }

    // 3. Montagem do proxy reverso
    const remainderPath = '/' + pathSegments.slice(3).join('/');
    const targetUrl = new URL(remainderPath + url.search, `https://${targetDomain}`);

    const proxyRequest = new Request(targetUrl.toString(), request);
    proxyRequest.headers.set('Host', targetDomain);
    proxyRequest.headers.set('X-Forwarded-Host', url.host);
    proxyRequest.headers.set('X-Forwarded-Proto', url.protocol.replace(':', ''));

    const originResponse = await fetch(proxyRequest);
    const newResponseHeaders = new Headers(originResponse.headers);
    newResponseHeaders.delete('Set-Cookie');

    // 4. Reescrita de cada cookie individualmente
    const setCookies: string[] = [];
    originResponse.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') setCookies.push(value);
    });
    for (const cookie of setCookies) {
      const secureCookie = cookie
        .replace(/Domain=[^;]+/i, `Domain=${url.host}`)
        .replace(/Path=[^;]+/i, `Path=/apps/${projectSlug}`);
      newResponseHeaders.append('Set-Cookie', secureCookie);
    }

    return new Response(originResponse.body, {
      status: originResponse.status,
      statusText: originResponse.statusText,
      headers: newResponseHeaders
    });
  }
};

// Decodifica Base64Url com padding dinâmico
function decodeBase64Url(input: string): string {
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

// Valida assinatura RS256 usando Web Crypto nativo
async function verifyEdgeJWTSecure(token: string, pemPublicKey: string): Promise<boolean> {
  try {
    const [headerB64, payloadB64, signatureB64] = token.split('.');
    if (!headerB64 || !payloadB64 || !signatureB64) return false;

    // Decodifica payload e verifica expiração
    const payloadString = decodeBase64Url(payloadB64);
    const payload = JSON.parse(payloadString);
    if (payload.exp && Date.now() >= payload.exp * 1000) return false;

    // Remove cabeçalhos/footers e whitespace da chave PEM
    const pemContents = pemPublicKey
      .replace(/-----BEGIN PUBLIC KEY-----/, '')
      .replace(/-----END PUBLIC KEY-----/, '')
      .replace(/\s/g, '');

    const binaryDerString = atob(pemContents);
    const binaryDer = new Uint8Array(binaryDerString.length);
    for (let i = 0; i < binaryDerString.length; i++) {
      binaryDer[i] = binaryDerString.charCodeAt(i);
    }

    const cryptoKey = await crypto.subtle.importKey(
      'spki',
      binaryDer.buffer,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // A assinatura JWT é sobre o texto base64url: header + '.' + payload
    const encoder = new TextEncoder();
    const dataToVerify = encoder.encode(`${headerB64}.${payloadB64}`);

    // Decodifica assinatura de base64url para ArrayBuffer
    const sigBinaryString = decodeBase64Url(signatureB64);
    const sigBinary = new Uint8Array(sigBinaryString.length);
    for (let i = 0; i < sigBinaryString.length; i++) {
      sigBinary[i] = sigBinaryString.charCodeAt(i);
    }

    return await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      cryptoKey,
      sigBinary,
      dataToVerify
    );
  } catch {
    return false;
  }
}
