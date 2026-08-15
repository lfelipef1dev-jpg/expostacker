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

### Novo projeto (script automatico)

```powershell
.\scripts\novo-projeto.ps1 -Nome "novo-projeto" -Pasta "C:\PROJETOS\..." -CloudflareProject "nome-no-cloudflare" -Diretorio "out"
```

O script faz tudo: git init, cria repo no GitHub, adiciona secrets, cria workflow, faz push e deploy.

### Projetos no ecossistema

| Repo GitHub | Cloudflare Pages | Dominio | Diretorio |
|---|---|---|---|
| expostacker | expostacker | expostacker.com.br | dist |
| casa-fassi | marken-fassi | marken.expostacker.com.br | out |
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
