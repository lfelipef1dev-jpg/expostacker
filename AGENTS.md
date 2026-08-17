# Expostacker — Site Principal

## Comandos

```bash
npm run dev      # desenvolvimento
npm run build    # build estático (11 páginas)
npm run check    # astro check (0 errors esperado)
npm run preview  # preview local
```

## Stack

- Astro 4.16.19 (static output)
- TypeScript
- Tailwind CSS
- i18n PT/EN

## Estrutura de Cases

### Padrão de página de case (CASA FASSI como referência)

Cada case segue esta estrutura de componentes, nesta ordem:

1. **CaseHeroV2** — hero split com texto + browser mockup ao vivo
2. **CaseSnapshot** — card compacto de metadados (cliente, setor, timeline, live URL)
3. **CaseStory** — contexto, problema, abordagem, solução
4. **CaseTimeline** — fases do projeto em grid horizontal (3 colunas)
5. **CaseMethodology** — metodologia em cards numerados (grid 3 colunas)
6. **CaseArchitecture** — diagrama C4 conceitual + lista de itens + disclaimer
7. **CaseTechStack** — stack por categoria com "why" e "alt" (alternativa rejeitada)
8. **CaseDecisionLog** — decisões técnicas com justificativa e alternativas
9. **CaseAI** — pipeline do assistente em steps verticais
10. **CaseGamification** — mecânicas em grid 4 colunas + loop de engajamento horizontal
11. **CaseSecurity** — itens de segurança com ícones SVG inline (NUNCA emojis)
12. **CaseResultsV2** — KPIs em grid 6 colunas com sparkline SVG, baseline e fonte
13. **CaseLessons** — lições aprendidas em texto solto, centralizado
14. **CaseCTA** — call to action final

### Alinhamento (REGRA OBRIGATÓRIA)

Todos os componentes case usam o MESMO container:

```html
<section class="py-12 md:py-16 max-w-6xl mx-auto px-4 md:px-6">
```

Exceção: CaseHeroV2 tem padding próprio (hero é diferente).

O `<article>` wrapper em `[slug].astro` também usa `max-w-6xl`.

NUNCA usar `max-w-4xl` em componentes case — causa desalinhamento.

### Hero (CaseHeroV2) — padrão split

Estrutura:
1. Eyebrow no topo (`pt-2 md:pt-3`) — "PROJETO EM PRODUÇÃO" / "LIVE PROJECT"
2. H1 logo abaixo, largura total, `clamp(1.75rem, 3.5vw + 0.5rem, 3rem)`
3. Split grid `lg:grid-cols-[1.1fr_1fr]` com `items-end`:
   - Esquerda: subhead + CTAs (alinhados na base)
   - Direita: browser mockup com iframe ao vivo
4. Stack badges centralizado abaixo do split
5. Hero metrics centralizado abaixo dos badges (3 colunas, `text-center`)

Prioridade de exibição do mockup:
1. `heroImage` no JSON → screenshot
2. `liveUrl` no JSON → iframe ao vivo
3. Fallback → mockup CSS animado

### Schema (src/content/config.ts)

Campos obrigatórios:
- `id`, `title`, `clientName`, `tags`, `shortDescription`
- `problemDescription`, `technicalSolution`
- `businessOutcome` (array de KPIs)
- `liveUrl`, `projectType`, `featured`, `category`, `year`

Campos opcionais (case study):
- `heroHeadline`, `heroSubhead`, `heroImage`
- `opening`, `challengeContext`, `approach`
- `solutionIntro`, `solutionItems`
- `decisionLog`, `technologies`, `myRole`, `lessonsLearned`
- `stakeholders`, `sector`
- `heroMetrics`, `timeline`, `timelinePhases`
- `nda`, `visualDisclaimer`
- `methodology`, `aiPipeline`, `gamification`
- `security`, `techStack`, `architecture`, `resultsDetail`

### Localização (i18n)

- PT e EN sempre
- Campos localizados usam `{ pt: "...", en: "..." }`
- Componentes acessam via `field?.[lang]` com fallback
- NUNCA acessar `field.pt` diretamente — usar optional chaining

### Conteúdo JSON — regras

#### Proibido
- Emojis (usar SVG inline)
- Valores comerciais (preços, custos, orçamentos, ROI)
- Claims técnicas não verificadas (RAG se não tem RAG, Server Components se é export estático)
- Métricas sem qualificação (baseline, fonte, período)

#### Obrigatório
- Métricas qualificadas: "(estimado)", "(meta)", "(piloto)", "(alvo)"
- Claims técnicas honestas: se é MVP, dizer MVP; se é roadmap, dizer roadmap
- Disclaimer de NDA quando aplicável
- `visualDisclaimer` para anonimização

### Design tokens (tailwind.config.mjs)

Dark 2026:
- `brand-bg`: `#0A0A0A`
- `brand-surface`: `#1A1A1A`
- `brand-elevated`: `#252525`
- `brand-border`: `rgba(255,255,255,0.12)`
- `brand-text`: `#E6E6E6`
- `brand-text-secondary`: `rgba(230,230,230,0.70)`
- `brand-accent`: `#8AB4F8`
- `brand-accent-hover`: `#AECBFA`

### Tipografia

- Display: Space Grotesk
- Body: Inter
- Mono: JetBrains Mono
- Fluid: `clamp()` para headings
- Body: `text-sm` ou `text-base`

### Acessibilidade

- Skip link
- `aria-labelledby` em sections
- Focus visible (`focus-visible:ring-2`)

## Deploy Automatico

### Fluxo (100% automatico)

1. `git push` na branch `main`
2. GitHub Actions roda: install → build → deploy
3. Cloudflare Pages publica automaticamente
4. Site no ar em ~1 minuto

### Credenciais (NUNCA commitar)

- Arquivo local: `.deploy.env` (gitignored)
- Secrets no GitHub: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
- Mesmo token serve para todos os projetos do ecossistema
- Global API Key do Cloudflare salva no `.deploy.env` para criar CNAME automatico

### Novo projeto (script automatico)

```powershell
.\scripts\novo-projeto.ps1 -Nome "novo-projeto" -Pasta "C:\PROJETOS\..." -CloudflareProject "nome-no-cloudflare" -Subdominio "nome" -Diretorio "out"
```

O script faz tudo automaticamente:
1. Git init + commit
2. Cria repo no GitHub
3. Adiciona secrets no GitHub
4. Cria projeto no Cloudflare Pages
5. Cria CNAME no DNS (subdominio.expostacker.com.br)
6. Cria workflow de deploy
7. Push → deploy automatico

### Projetos no ecossistema

#### Projetos estaticos (Cloudflare Pages)

| Repo GitHub | Cloudflare Pages | Dominio | Diretorio |
|---|---|---|---|
| expostacker | expostacker | expostacker.com.br | dist |
| casa-fassi | marken-fassi | marken.expostacker.com.br | out |
| sanatto-facilities | sanatto-facilities | sanatto.expostacker.com.br | out |

#### Projetos full-stack (Cloudflare Workers + OpenNext)

| Repo GitHub | Worker | Dominio | Banco |
|---|---|---|---|
| seeds-experience | seeds-app | seeds.expostacker.com.br | Supabase (phhurravjunielzxatxe) |

## Deploy Automatico — Projetos Full-Stack

Projetos Next.js com banco de dados, auth, API routes e realtime usam
**Cloudflare Workers + @opennextjs/cloudflare** (nao Pages).

### Diferenca entre os dois fluxos

| | Estatico (Pages) | Full-stack (Workers) |
|---|---|---|
| Tipo | Astro, Next.js export estatico | Next.js App Router com SSR |
| Banco | Nenhum | Supabase (Postgres + Auth + Storage + Realtime) |
| Hosting | Cloudflare Pages | Cloudflare Workers |
| Adapter | Nenhum (build estatico) | @opennextjs/cloudflare |
| Node.js | 20 | 22+ (Wrangler 4.x exige) |
| Env vars | Apenas no GitHub | GitHub (build) + Worker (runtime) |
| Subdominio | CNAME para pages.dev | Workers custom domain |

### Fluxo full-stack (100% automatico)

1. `git push` na branch `main`
2. GitHub Actions roda: install -> opennextjs-cloudflare build -> deploy
3. Worker publicado na Cloudflare
4. Subdominio `*.expostacker.com.br` aponta para o Worker
5. Site no ar em ~2 minutos

### Novo projeto full-stack (script automatico)

```powershell
.\scripts\novo-projeto-fullstack.ps1 `
  -Nome "meu-app" `
  -Pasta "C:\PROJETOS\EXPOSTACKER\meu-app" `
  -Subdominio "meu" `
  -SupabaseUrl "https://xxx.supabase.co" `
  -SupabaseAnonKey "sb_publishable_xxx" `
  -SupabaseServiceKey "sb_secret_xxx"
```

O script faz tudo automaticamente:
1. Git init + commit + push
2. Cria repo no GitHub
3. Adiciona secrets no GitHub (build-time)
4. Instala @opennextjs/cloudflare + wrangler + esbuild
5. Cria wrangler.jsonc, open-next.config.ts, .dev.vars, public/_headers
6. Cria GitHub Actions workflow (Node 22, opennextjs-cloudflare build+deploy)
7. Aguarda primeiro deploy
8. Configura subdominio via Workers Domains API
9. Seta secrets no Worker (runtime) via Cloudflare API

### Arquivos necessarios no projeto full-stack

```
wrangler.jsonc          # config do Worker
open-next.config.ts     # config do OpenNext
.dev.vars               # env vars de desenvolvimento local
public/_headers         # cache de assets estaticos
.github/workflows/deploy.yml  # CI/CD
```

### Env vars — ATENCAO

Projetos full-stack precisam de env vars em DOIS lugares:

1. **GitHub Secrets** (build-time) — injetadas durante o build
   - `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`

2. **Worker Secrets** (runtime) — disponiveis em execucao
   - `SUPABASE_SERVICE_ROLE_KEY` (CRITICO — nao funciona sem isso)
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`

O script `novo-projeto-fullstack.ps1` configura ambos automaticamente.
Se faltar o secret no Worker, o app da "Application error: a server-side
exception has occurred" ao tentar acessar rotas que usam o service role key.

### Supabase — configuracao necessaria no painel

Para cada projeto full-stack com Supabase:

1. **Auth > URL Configuration**
   - Site URL: `https://[subdominio].expostacker.com.br/`
   - Redirect URLs: `https://[subdominio].expostacker.com.br/auth/callback`

2. **Auth > Providers > Email**
   - Desativar "Confirm signup" e "Enable email confirmations"
   - Desativar public signup se for invite-only

3. **Database > Realtime**
   - Ativar nas tabelas que precisam realtime (ex: messages, rooms)

4. **Storage**
   - Criar buckets necessarios (ex: feed-images, avatars, public)
   - Marcar como public os que precisam acesso publico de leitura

5. **RLS (Row Level Security)**
   - DEVE estar ativado em TODAS as tabelas do schema public
   - Sem RLS = vulnerabilidade critica (qualquer um com a anon key acessa tudo)

### Limite de tamanho do Workers

Cloudflare Workers aceita assets de ate 25 MiB cada.
Arquivos maiores (PDFs, videos) devem ser hospedados em:
- Supabase Storage (ate 50 MiB via API REST, ou 5 GB via S3 protocol)
- Cloudflare R2 (sem limite pratico)
- Referenciar via URL externa no codigo, nao incluir na pasta public/

### Migracao de Netlify para Cloudflare Workers

Se um projeto ja esta no Netlify e precisa migrar:

1. Instalar `@opennextjs/cloudflare` + `wrangler` + `esbuild`
2. Remover `@netlify/plugin-nextjs` e `netlify.toml`
3. Criar `wrangler.jsonc`, `open-next.config.ts`, `.dev.vars`
4. Atualizar `next.config.ts` com `initOpenNextCloudflareForDev()`
5. Atualizar `.env.local` para apontar ao Supabase cloud (nao local)
6. Criar workflow com Node 22 + `opennextjs-cloudflare build && deploy`
7. Configurar secrets no GitHub E no Worker
8. Configurar subdominio via Workers Domains API
9. Atualizar Auth redirect URLs no Supabase
10. Manter Netlify ativo ate validar o novo deploy
11. So desativar Netlify apos confirmar que tudo funciona

### Regra absoluta de deploy

- NUNCA pedir para o usuario criar CNAME manualmente
- NUNCA pedir para o usuario adicionar secrets manualmente
- O script `novo-projeto.ps1` faz TUDO sozinho
- Se faltar permissao, usar a Global API Key do `.deploy.env`
- Todo projeto novo vai para `C:\PROJETOS\EXPOSTACKER\` como subpasta
- Todo projeto novo ganha subdominio automatico em `*.expostacker.com.br`

### Acessibilidade

- Skip link
- `aria-labelledby` em sections
- Focus visible (`focus-visible:ring-2`)
- Touch targets min 48px (`min-h-12`)
- `prefers-reduced-motion` respeitado
- SVGs com `aria-hidden="true"` quando decorativos

### Performance

- Static output (sem SSR)
- Imagens com `width`/`height` para evitar CLS
- iframe com `loading="lazy"`
- CSS-only diagrams (sem libs de chart)
- Sparklines SVG inline (sem JS)

## Rotas

- `/` — redirect para `/pt/`
- `/pt/` e `/en/` — home
- `/pt/cases/[slug]/` e `/en/cases/[slug]/` — cases
- `/pt/contato/` e `/en/contato/` — contato

## Cases existentes

- `marken-fassi` — CASA FASSI (featured, completo)
- `gerenciador-frotas` — Gerenciador de Frotas
- `sistema-faturamento-saas` — Sistema de Faturamento SaaS

## Banner Rotativo (HeroBanner)

### Pastas de imagens (REGRA ABSOLUTA)

Toda imagem do banner fica em `public/banner/`, com o padrão `public/banner/[id]-banner.jpg`.
Toda imagem dos cards fica em `public/cases/`, com o padrão `public/cases/[id]-hero.jpg`.

**NUNCA misturar as pastas.** Cada projeto tem duas imagens:
1. `public/banner/[id]-banner.jpg` — 900x900, para o banner rotativo
2. `public/cases/[id]-hero.jpg` — 1440x900, para os cards da grade

### Dimensões do banner

- Proporção: 1:1 (quadrado)
- Resolução: 900x900px
- Formato: JPG
- Qualidade: 90%

### Como capturar o screenshot do banner

Usar o script `scripts/screenshot-banner.cjs` (captura todos os 11) ou `screenshot-banner-fix.cjs` (captura apenas os listados no array).

Para sites com conteúdo maior que 900px de altura, ajustar `scrollBy` no script fix até o card ficar centralizado.

### Limites de texto no banner

O componente `HeroBanner.astro` usa `line-clamp` e `truncate` para evitar encavalamento:

| Campo | Máximo de linhas | Nota |
|-------|------------------|------|
| Nome do cliente | 1 linha | `text-3xl font-black` |
| Descrição | 4 linhas | `line-clamp-4` |
| Label da métrica | 1 linha | `truncate` + tooltip |
| Métricas | 3 itens | `slice(0, 3)` |

### Padrão de métricas (APROVADO)

Cada métrica tem 2 elementos visuais:
1. **Número grande** em azul, `font-mono`, `tabular-nums`, `text-xl`
2. **Label curta** (máximo 2 palavras) em 1 linha, `text-xs`, `truncate`, com `title` (tooltip)

**Regra:** labels longas vão no `title` (tooltip no hover), não no card.
Exemplo: `"Vendas"` com title `"Aumento de Vendas (estimado)"`.

Labels padronizadas por projeto:
- TigreBet: Jogos, Rotas API, Tabelas
- Medellin: Páginas, Produtos, Tiers VIP
- Frotamais: Veículos, Viagens, Redução
- SEEDS: Rotas, Tabelas, Tabelas RLS
- CASA FASSI: Vendas, Engajamento, Churn
- VivaMais: Especialidades, Convênios, Profissionais
- SolMais: Performance, Acessibilidade, Contraste
- GordaoMod: Produtos, Categorias, Páginas
- Sanatto: Páginas, Lighthouse, Build
- Faturamais: Fechamento, Conversão, Performance
- VendaMais: Produtos, Performance, Acessibilidade

### Padrão visual do banner (APROVADO)

- Card com altura fixa: 500px mobile, 560px tablet, 600px desktop
- Grid 2 colunas no desktop: texto esquerda, imagem direita
- Imagem 1:1 preenche o lado direito com `object-cover`
- `object-position: 25% center` (imagem puxada pra esquerda)
- Texto alinhado verticalmente com `flex-col h-full justify-between`
- Logo do projeto: card 72-120px com a imagem do banner + nome ao lado
- CTA primário e secundário lado a lado (ou empilhado no mobile)
- Métricas em grid 3 colunas com `border-l-2` azul

### Header (APROVADO)

- Altura fixa: 64px (`h-16`)
- Sticky com sombra ao rolar
- Scroll spy com IntersectionObserver (link ativo muda cor)
- Active state: dot azul embaixo do link ativo
- Seletor de idioma: círculo com sigla + nome do idioma alvo
- Mobile: hamburger com ícone X ao abrir, fecha ao clicar link
- Acessibilidade: `aria-current`, `aria-expanded`, `aria-controls`, `role="menubar"`

### TrustBar (faixa de prova)

- 5 stats: 11 projetos, 100% no ar, 8+ tecnologias, 100% código público, CI/CD
- Padding: `py-12 md:py-16` (respiro generoso)
- Grid 2 colunas mobile, 5 colunas desktop

### Adicionar um novo projeto ao banner

1. Criar `public/banner/[id]-banner.jpg` (900x900)
2. Verificar `priority` no JSON para a ordem de exibição
3. Não precisa alterar `HeroBanner.astro` — ele lê automaticamente da pasta `public/banner/`

## Novo case — checklist

1. Criar `src/content/cases/[slug].json` com todos os campos
2. Adicionar `heroImage` opcional em `public/cases/[slug].jpg`
3. Verificar `npm run check` (0 errors)
4. Verificar `npm run build` (11+ páginas)
5. Confirmar alinhamento `max-w-6xl` em todos componentes
6. Confirmar sem emojis
7. Confirmar sem valores comerciais
8. Confirmar métricas qualificadas
9. Confirmar claims técnicas honestas
10. Testar PT e EN

## Ordenacao de Cases (REGRA ABSOLUTA)

### Campo `priority`

Cada case tem um campo `priority` (numero inteiro) no JSON.
O BentoGrid ordena os cards por `priority` (menor = primeiro card).

### Ordem atual

| priority | Projeto | Justificativa comercial |
|----------|---------|------------------------|
| 1 | tigrebet | Plataforma com auth, pagamento, banco. 12 tecnologias. Mais procura. |
| 2 | medellin-ecommerce | E-commerce completo com pagamento, estoque, entrega. Mercado gigante. |
| 3 | gerenciador-frotas | SaaS com dashboard, auth, mapa, rastreamento. Empresas pagam premium. |
| 4 | seeds-experience | Rede social com IA e realtime. Produto digital moderno. |
| 5 | marken-fassi | IA propria + gamificacao + LXP. Diferencial unico. |
| 6 | vivamais | Site de clinica com agendamento e SEO. Mercado de saude gigante. |
| 7 | solmais | Landing page padrao. Produto de entrada. |
| 8 | gordaomod | Loja de produtos digitais. 182 produtos. Nicho gamer. |
| 9 | sanatto-facilities | Site institucional Next.js. Bonito mas sem recursos. |
| 10 | sistema-faturamento-saas | HTML simples. Cumpre o basico. |
| 11 | vendamais | Landing simples HTML. Produto de entrada minimo. |

### Criterios de ordenacao

A ordem e definida por:

1. **Maior procura de mercado** — o que mais vende, o que mais cliente procura
2. **Tecnologias mais quentes** — Next.js, auth, pagamento, banco, IA, realtime
3. **Valor comercial** — quanto o cliente paga por esse tipo de projeto
4. **Engajamento** — plataformas e SaaS geram mais interesse que landing pages
5. **Palavras-chave** — SaaS, e-commerce, auth, pagamento, dashboard, IA, realtime

### Projeto novo

- Entra **sem `priority`** → aparece no final
- O usuario define a posicao e seta o numero
- NAO usar scripts automaticos (Lighthouse, etc) para ordenar
- A ordenacao e **manual e comercial**, nao tecnica

### Regra absoluta

- NUNCA reordenar cases sem autorizacao explicita do usuario
- NUNCA usar score automatico para ordenar
- A ordenacao reflete **estrategia comercial**, nao complexidade tecnica
