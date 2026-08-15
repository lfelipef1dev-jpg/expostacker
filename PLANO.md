# PLANO - EXPOTACKER (expostacker.com.br)

Arquitetura de custo zero para desenvolvedor Full Stack com multiplos projetos e clientes.

---

## 1. COMO COMEAR DO ZERO (Arquitetura Hibrida "Content-Driven")

**Ordem proposta:**

1. Estruturaao do Core Data: arquivos markdown/JSON com case studies.
2. Configurao do Gateway de Borda (Edge): apontar DNS para Cloudflare antes do site.
3. Build do Portfolio Principal: site estatico consumindo o core data.
4. Deploy e Roteamento Avancado: subir site e conectar aplicacoes Full Stack secundarias.

---

## 2. PROJETOS ONLINE NO MESMO DOMINIO (Custo Zero)

**Tecnica proposta:** Reverse Proxy com Cloudflare Workers.

- `expostacker.com.br/` -> Cloudflare Pages (portfolio)
- `expostacker.com.br/saas-cliente` -> Render/Railway/Fly.io (backend/full stack) via proxy

Para o usuario e para o SEO, o projeto parece estar dentro do site principal.

---

## 3. STACK FULL STACK 100% GRATUITO (Padrao 2026)

| Camada | Ferramentas |
|--------|-------------|
| Banco relacional | Neon, Supabase |
| Banco NoSQL | MongoDB Atlas |
| Backend/Containers | Render, Railway, Fly.io, Koyeb |
| Autenticacao | Clerk, Auth0 |

---

## 4. SEPARACAO PROJETOS PROPRIOS VS CLIENTES

- Nao hospedar banco/API de clientes na propria conta gratuita.
- Contas organizacionais gratuitas para o cliente; voce entra como membro tecnico convidado.
- Site principal (`/client-work`) exibe case study + metricas; projeto ao vivo fica em URL temporaria do cliente ou espelho estatico.

---

## 5. PONTOS A APROFUNDAR

1. Arquitetura de Roteamento: Cloudflare Workers proxy para multiplos projetos.
2. Seguranca e Isolamento: secrets, RBAC e acessos de clientes.
3. Ecossistema de Bancos Gratis: limites reais de Neon, Supabase, TiDB.

---

## 6. ANALISE CRITICA DO PLANO

### Pontos certos (consistentes com pesquisa de mercado)

- Cloudflare como gateway de borda e custo zero e correto.
- Core data antes do design e uma pratica de referencia (Lee Robinson, Josh Comeau).
- Subdiretorios consolidam autoridade SEO.
- Contas separadas para clientes e necessaria.

### Riscos e simplificacoes

- Proxy reverso via Workers exige cuidado com CORS, cookies, sessao e WebSocket.
- SEO de apps dinamicos atras de proxy pode ter dificuldades.
- Planos "gratuitos" tem limites de recursos que precisam ser quantificados.
- "Membro convidado" ainda expoe credenciais; e necessario RBAC e RLS.
- O plano nao menciona email profissional e branding pessoal, pontos destacados na pesquisa.

### Duvidas tecnicas a resolver

1. Como espelhar um app que roda no dominio do cliente dentro de `expostacker.com.br/cliente`?
2. Sessao/cookie de cliente funciona no subdiretorio do seu dominio?
3. Cloudflare Workers free: 1M requisicoes/dia. Quantos clientes cabem?
4. Seus proprios projetos usam banco pessoal (Supabase/Neon) separado?

---

Status: AGUARDANDO APROVACAO DO USUARIO.
