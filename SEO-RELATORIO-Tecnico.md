# Relatório Técnico de SEO — ExpoStacker

**Data:** 17 de agosto de 2026
**Site:** https://expostacker.com.br
**Repo:** https://github.com/lfelipef1dev-jpg/expostacker.git
**Branch:** main
**Último commit:** `46c640d` — SEO: implementa todas as melhorias tecnicas

---

## 1. Stack técnica do site

- **Framework:** Astro 4.16.19 (static output — HTML estático)
- **Linguagem:** TypeScript
- **Estilo:** Tailwind CSS
- **i18n:** PT-BR e EN-US
- **Hosting:** Cloudflare Pages
- **CI/CD:** GitHub Actions (push → build → deploy → cache purge)
- **Build:** 28 páginas + sitemap de imagens (26 páginas)

### Por que Astro estático é vantagem para SEO

93% dos sites falham em AI retrieval porque usam JavaScript no client-side.
O Astro gera HTML estático no build, então todo o conteúdo está visível para:
- Googlebot
- Bingbot
- GPTBot (OpenAI)
- ClaudeBot (Anthropic)
- PerplexityBot
- CCBot (Common Crawl)
- AppleBot-Extended

---

## 2. Técnicas de SEO implementadas

### 2.1. Meta tags (todas as páginas)

| Meta tag | Status | Onde |
|----------|--------|------|
| `<title>` | Otimizado com longa cauda | `BaseHead.astro` |
| `<meta name="description">` | Otimizada por página | `BaseHead.astro` |
| `<meta name="keywords">` | Keywords por página (Bing e crawlers) | `BaseHead.astro` |
| `<meta name="robots">` | `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1` | `BaseHead.astro` |
| `<meta name="author">` | Expo Stacker | `BaseHead.astro` |
| `<meta name="theme-color">` | #0A0A0F | `BaseHead.astro` |
| `<link rel="canonical">` | URL canônica por página | `BaseHead.astro` |

### 2.2. Open Graph e Twitter Card

| Tag | Status |
|-----|--------|
| `og:title` | Por página |
| `og:description` | Por página |
| `og:url` | URL canônica |
| `og:type` | `website` (home) / `article` (cases) |
| `og:site_name` | Expo Stacker |
| `og:locale` | pt_BR / en_US |
| `og:locale:alternate` | en_US / pt_BR |
| `og:image` | URL da imagem |
| `og:image:width` | 1200 |
| `og:image:height` | 630 |
| `twitter:card` | summary_large_image |
| `twitter:title` | Por página |
| `twitter:description` | Por página |
| `twitter:image` | URL da imagem |

### 2.3. hreflang (internacionalização)

```html
<link rel="alternate" hreflang="pt-BR" href="https://expostacker.com.br/pt/" />
<link rel="alternate" hreflang="en" href="https://expostacker.com.br/en/" />
<link rel="alternate" hreflang="x-default" href="https://expostacker.com.br/pt/" />
```

Presente em todas as páginas. Ajuda o Google a entender que o site tem versões em PT e EN.

### 2.4. JSON-LD Structured Data (Schema.org)

#### Schemas em todas as páginas

| Schema | Tipo | Função |
|--------|------|--------|
| Organization | `@type: Organization` | Identidade da empresa (substituiu Person) |
| WebSite | `@type: WebSite` | Estrutura do site + SearchAction |
| Service | `@type: Service` | Serviço oferecido |

#### Schemas na home page

| Schema | Tipo | Função |
|--------|------|--------|
| FAQPage | `@type: FAQPage` | 8 perguntas e respostas para rich results |
| Speakable | `@type: WebPage` com `SpeakableSpecification` | Destaque para busca por voz |

#### Schemas nas páginas de case

| Schema | Tipo | Função |
|--------|------|--------|
| BreadcrumbList | `@type: BreadcrumbList` | Navegação estruturada (Home > Produtos > Case) |
| Article | `@type: Article` | Conteúdo do case como artigo |
| WebPage | `@type: WebPage` | Página web com breadcrumb |
| ImageObject | `@type: ImageObject` | Imagem do hero do case |

#### Exemplo do schema Organization

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Expo Stacker",
  "url": "https://expostacker.com.br",
  "logo": "https://expostacker.com.br/logo.png",
  "description": "Estúdio de produtos digitais. 11 produtos ao vivo...",
  "sameAs": ["https://github.com/lfelipef1dev-jpg"],
  "areaServed": "Brasil e exterior",
  "knowsAbout": ["SaaS development", "E-commerce development", ...]
}
```

### 2.5. SEO para IA (GEO — Generative Engine Optimization)

#### llms.txt

Arquivo: `public/llms.txt`

Resumo do site em texto plano para que LLMs (ChatGPT, Claude, Perplexity) entendam o que o site faz. Inclui:
- Descrição do negócio
- Lista de serviços
- Lista dos 11 produtos ao vivo
- Stack tecnológica
- Contato
- Sitemap de URLs
- Notas para sistemas de IA

#### ai.md

Arquivo: `public/ai.md`

Diretrizes para crawlers de IA:
- Lista de crawlers permitidos
- Guidelines de conteúdo
- Formato preferido de citação
- Schemas disponíveis
- Contato para correções

#### robots.txt atualizado

```
User-agent: *
Allow: /

# AI crawlers permitidos
GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User,
PerplexityBot, CCBot, Google-Extended, AppleBot-Extended, Bytespider

# Crawlers pesados com delay
SemrushBot: Crawl-delay 10
AhrefsBot: Crawl-delay 10

Sitemap: https://expostacker.com.br/sitemap-index.xml
Sitemap: https://expostacker.com.br/sitemap-images.xml
```

### 2.6. Sitemap

| Sitemap | Arquivo | Geração |
|---------|---------|---------|
| Sitemap principal | `sitemap-index.xml` | `@astrojs/sitemap` (automático) |
| Sitemap de imagens | `sitemap-images.xml` | `scripts/generate-image-sitemap.cjs` (rodado no build) |

O sitemap de imagens lista todas as imagens dos cases (hero, banner, logo) associadas às suas páginas.

### 2.7. Title e Description otimizados (longa cauda)

#### Home PT
- **Title:** `Expo Stacker | Desenvolvimento de produtos digitais — 11 produtos ao vivo`
- **Description:** `Desenvolvimento de produtos digitais ao vivo: SaaS, e-commerce, sites, MVPs e automação com IA. 11 aplicações em produção com domínio próprio, deploy automático e código público. Construo o seu.`
- **Keywords:** `desenvolvimento de produtos digitais, desenvolvedor SaaS, desenvolvedor e-commerce, criar plataforma SaaS, desenvolvedor full stack Brasil, produtos digitais ao vivo, deploy automático, MVP development, automação com IA, chatbot IA, site profissional, landing page conversão, Cloudflare, Supabase, Astro, Next.js`

#### Home EN
- **Title:** `Expo Stacker | Digital product development — 11 live products`
- **Description:** `Digital product development: SaaS, e-commerce, websites, MVPs, and AI automation. 11 live applications in production with custom domains, automatic deploy, and public code. I build yours.`

#### Cases
- **Title:** `{nome do case} — Case | Expo Stacker`
- **Description:** `shortDescription` do case (até 160 chars)
- **Keywords:** `{nome do case}, {cliente}, case de desenvolvimento, produto digital ao vivo, {tags do case}`

#### Contato
- **Title:** `Contato — contratar desenvolvimento de produto digital | Expo Stacker`
- **Description:** `Fale comigo para construir seu produto digital. SaaS, e-commerce, site, MVP ou automação com IA. Resposta em até 24 horas.`
- **Keywords:** `contratar desenvolvedor, contato desenvolvimento de software, orçamento SaaS, orçamento e-commerce, desenvolvedor full stack, proposta de desenvolvimento, consultoria de produto digital`

### 2.8. Coerência Title/H1

Pesquisa de 30k keywords (John McAlpin / Search Engine Land, Q1 2025): quando title e H1 são tematicamente coerentes, o Google reescreve o título de 76% para ~20%.

Verificado em todas as páginas:
- Home: title e H1 coerentes
- Cases: title e H1 coerentes
- Contato: title e H1 coerentes

### 2.9. Alt text otimizado

Antes:
```html
alt="Preview de TigreBet"
alt="Prévia da aplicação TigreBet"
alt="Logotipo do cliente TigreBet"
```

Depois:
```html
alt="TigreBet — TigreBet | produto digital ao vivo"
alt="Screenshot do produto TigreBet — TigreBet em produção"
alt="Logo TigreBet — TigreBet"
```

Inclui keywords relevantes para SEO de imagem.

### 2.10. Internal linking cirúrgico

Componente: `src/components/case/CaseRelated.astro`

Adicionado no final de cada página de case, antes do CTA. Mostra 3 cases relacionados por:
1. Tags compartilhadas (score por tag em comum)
2. Fallback: próximos cases alfabeticamente

Cada link tem:
- Logo do cliente
- Nome do cliente
- Título do case
- Descrição curta
- CTA "Ver case →"

Isso cria a estrutura hub-and-spoke recomendada para topical authority.

### 2.11. Core Web Vitals

| Métrica | Otimização | Status |
|---------|------------|--------|
| LCP (Largest Contentful Paint) | Preload do logo com `fetchpriority="high"` | Implementado |
| CLS (Cumulative Layout Shift) | Imagens com `width`/`height` definidos | Já existia |
| INP (Interaction to Next Paint) | Carousel com CSS scroll-snap (sem JS pesado) | Já existia |
| Fontes | `preconnect` + `preload` + `display=swap` | Já existia |

### 2.12. Favicon

| Arquivo | Tamanho | Uso |
|---------|---------|-----|
| `public/favicon.png` | 512x512 | Favicon principal |
| `public/favicon-32.png` | 32x32 | Favicon pequeno |
| `public/apple-touch-icon.png` | 180x180 | iOS home screen |

### 2.13. Logo

| Arquivo | Tamanho | Uso |
|---------|---------|-----|
| `public/logo.png` | 640x213 (188KB) | Header do site |

Header: `src/components/Header.astro` — usa `<img>` com `h-11` (44px) e `my-1`.

---

## 3. Arquivos modificados/criados

### Arquivos novos

| Arquivo | Função |
|---------|--------|
| `public/llms.txt` | Resumo do site para IA |
| `public/ai.md` | Diretrizes para crawlers de IA |
| `scripts/generate-image-sitemap.cjs` | Gera sitemap de imagens no build |
| `src/components/case/CaseRelated.astro` | Internal linking entre cases |

### Arquivos modificados

| Arquivo | Mudanças |
|---------|----------|
| `src/components/BaseHead.astro` | JSON-LD Organization, Service, meta robots, meta keywords, preload logo, OG image dimensions, schema param flexível |
| `src/pages/[lang]/index.astro` | Title/description otimizados, keywords, schema FAQPage + Speakable |
| `src/pages/[lang]/cases/[slug].astro` | Title otimizado, keywords, schemas BreadcrumbList + Article + WebPage + ImageObject, CaseRelated |
| `src/pages/[lang]/contato.astro` | Migrada para BaseHead com title/description/keywords otimizados |
| `src/components/FaqSection.astro` | Comentário referenciando schema FAQ |
| `src/components/HeroBanner.astro` | Alt text otimizado com keywords |
| `src/components/BentoGrid.astro` | Alt text otimizado com keywords |
| `public/robots.txt` | Adicionado ClaudeBot, Claude-User, CCBot, Google-Extended, AppleBot-Extended, Bytespider, sitemap de imagens |
| `package.json` | Build agora gera sitemap de imagens |

---

## 4. Validação

| Verificação | Resultado |
|-------------|-----------|
| `npm run build` | 28 páginas + sitemap de imagens (26 páginas) |
| `npm run check` | 0 errors, 0 warnings, 7 hints |
| HTML gerado (home PT) | Todas as meta tags e 5 schemas JSON-LD presentes |
| HTML gerado (case TigreBet) | Todas as meta tags e 7 schemas JSON-LD presentes |
| Deploy Cloudflare | Sucesso em 39s |
| Cache purge | Sucesso |

---

## 5. Lighthouse — status

O teste de Lighthouse não foi concluído hoje por dois motivos:

1. **Local:** O `chrome-launcher` no Windows tem um bug de permissão (`EPERM`) ao criar/deletar a pasta temporária do Chrome headless. É um problema conhecido da biblioteca no Windows.

2. **API do Google (PageSpeed Insights):** A API gratuita tem um limite de requisições por hora. O limite foi atingido (erro `429 Too Many Requests`). A API libera automaticamente após algumas horas.

**O que isso significa:** O site está pronto e todas as otimizações estão no ar. O Lighthouse é apenas uma ferramenta de medição — não afeta o site. Amanhã a API libera e o teste pode ser rodado.

**Como rodar amanhã:**
- Opção 1: Eu tento a API do Google novamente
- Opção 2: Você abre https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fexpostacker.com.br%2Fpt%2F no navegador e roda manualmente
- Opção 3: Você abre o Chrome DevTools (F12) → Lighthouse tab → Generate report

---

## 6. Tarefas pendentes

### Pendentes — eu faço

| # | Tarefa | Quando |
|---|--------|--------|
| 1 | Rodar Lighthouse e corrigir alertas | Amanhã (quando API liberar) |
| 2 | Criar 3-6 artigos no /blog/ para topical authority | Quando autorizar |
| 3 | Criar página de autor/bio com credenciais | Quando autorizar |
| 4 | Otimizar lead magnet e funil de vendas | Quando autorizar |
| 5 | Configurar BaseHead para usar og-image.png | Quando você criar a imagem |

### Pendentes — você faz

| # | Tarefa | Como |
|---|--------|------|
| 1 | **OG image PNG 1200x630** | Criar a imagem e colocar em `public/og-image.png` |
| 2 | **Google Search Console** | 1. Acessar https://search.google.com/search-console 2. Adicionar propriedade `https://expostacker.com.br` 3. Verificar propriedade (DNS TXT ou HTML tag) 4. Enviar sitemap: `https://expostacker.com.br/sitemap-index.xml` 5. Enviar sitemap de imagens: `https://expostacker.com.br/sitemap-images.xml` |
| 3 | **Bing Webmaster Tools** | 1. Acessar https://www.bing.com/webmasters 2. Adicionar site `https://expostacker.com.br` 3. Verificar propriedade 4. Enviar sitemap |
| 4 | **Depoimentos com nome/foto/cargo** | Coletar de clientes reais para E-E-A-T |

---

## 7. Estrutura de arquivos SEO

```
EXPOSTACKER - SITE PRINCIPAL/
├── public/
│   ├── llms.txt                    # Resumo para IA
│   ├── ai.md                       # Diretrizes para crawlers de IA
│   ├── robots.txt                  # Diretrizes para todos os crawlers
│   ├── logo.png                    # Logo (usado no header e schema)
│   ├── favicon.png                 # Favicon 512x512
│   ├── favicon-32.png              # Favicon 32x32
│   ├── apple-touch-icon.png        # Ícone iOS 180x180
│   ├── og-image.svg                # OG image atual (substituir por PNG)
│   └── _headers                    # Cache headers da Cloudflare
├── scripts/
│   └── generate-image-sitemap.cjs  # Gera sitemap de imagens no build
├── src/
│   ├── components/
│   │   ├── BaseHead.astro          # Meta tags, JSON-LD, hreflang, OG, Twitter
│   │   ├── Header.astro            # Logo no header
│   │   ├── HeroBanner.astro        # Alt text otimizado
│   │   ├── BentoGrid.astro         # Alt text otimizado
│   │   ├── FaqSection.astro        # FAQ com schema FAQPage
│   │   ├── Packages.astro          # 6 pacotes com modal de detalhes
│   │   └── case/
│   │       └── CaseRelated.astro   # Internal linking entre cases
│   ├── pages/
│   │   └── [lang]/
│   │       ├── index.astro         # Home com FAQPage + Speakable
│   │       ├── cases/
│   │       │   └── [slug].astro    # Cases com Breadcrumb + Article + WebPage + ImageObject
│   │       └── contato.astro       # Contato com BaseHead completo
│   └── i18n/
│       └── ui.ts                   # Strings PT/EN
├── astro.config.mjs                # Config com @astrojs/sitemap
└── package.json                    # Build gera sitemap de imagens
```

---

## 8. Próximos passos recomendados (prioridade)

### Alta prioridade (fazer primeiro)

1. **OG image PNG 1200x630** — WhatsApp, LinkedIn e Twitter não renderizam SVG
2. **Google Search Console** — cadastrar e submeter sitemaps
3. **Bing Webmaster Tools** — cadastrar e submeter sitemap
4. **Lighthouse** — rodar e corrigir alertas

### Média prioridade

5. **Página de autor/bio** — E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
6. **Depoimentos reais** — nome, foto, cargo, empresa
7. **3-6 artigos no /blog/** — topical authority (tópicos: "como validar ideia de produto digital", "quanto custa desenvolver SaaS", "MVP vs produto completo")

### Baixa prioridade (futuro)

8. **Lead magnet otimizado** — checklist, calculadora, template
9. **Backlinks** — guest posts, diretórios, HARO
10. **Google Analytics 4** — se ainda não configurado

---

## 9. Glossário

| Termo | Significado |
|-------|-------------|
| SEO | Search Engine Optimization — otimização para motores de busca |
| GEO | Generative Engine Optimization — otimização para IA (ChatGPT, Perplexity, Claude) |
| E-E-A-T | Experience, Expertise, Authoritativeness, Trustworthiness — sinais de confiança do Google |
| JSON-LD | Formato de dados estruturados para Schema.org |
| Schema.org | Vocabulário de tags estruturadas reconhecido pelo Google, Bing, etc. |
| hreflang | Atributo que indica o idioma de uma página |
| Canonical | URL canônica (versão principal de uma página) |
| Open Graph | Protocolo do Facebook para previews em redes sociais |
| Twitter Card | Protocolo do Twitter para previews |
| Core Web Vitals | Métricas de performance do Google (LCP, CLS, INP) |
| LCP | Largest Contentful Paint — tempo até o maior elemento visível |
| CLS | Cumulative Layout Shift — estabilidade visual |
| INP | Interaction to Next Paint — responsividade |
| Lighthouse | Ferramenta do Google para auditoria de performance, SEO, acessibilidade |
| PageSpeed Insights | Interface web do Lighthouse (pagespeed.web.dev) |
| llms.txt | Padrão novo para comunar com LLMs (como robots.txt para IA) |
| Topical Authority | Grau em que o Google considera o site autoridade em um tópico |
| Internal Linking | Links entre páginas do próprio site |
| Longa cauda | Palavras-chave específicas com menor volume mas maior intenção |
| Rich Snippet | Resultado de busca com informações extras (estrelas, FAQ, preços) |
| Sitemap | Lista de URLs do site para motores de busca |
| Sitemap de imagens | Lista de imagens associadas às páginas |

---

**Fim do relatório.**
