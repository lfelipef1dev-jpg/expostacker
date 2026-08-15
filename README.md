# Expo Stacker

Site principal e portfólio de Expo Stacker, construído com Astro, Tailwind v4 e Cloudflare.

## Estrutura

- `src/pages/[lang]/` — páginas internacionalizadas (PT/EN)
- `src/content/cases/` — cases de projeto validados por Zod
- `src/components/` — Bento Grid, Hero e Header
- `worker.ts` — proxy seguro para `/apps/*` com JWT na borda
- `.github/workflows/` — deploy automático do Pages e do Worker

## Comandos

```bash
npm install
npm run dev      # desenvolvimento
npm run check    # validação de tipos
npm run build    # build estático
npm run preview  # preview local
npm run deploy:worker  # deploy do worker via wrangler
```

## Deploy

- `https://a585aade.expostacker.pages.dev` — preview do Pages
- `https://expostacker-worker.lfelipef1-dev.workers.dev` — endpoint do Worker
- `expostacker.com.br` — domínio principal (aguardando propagação do DNS)

CI/CD ativado: todo push para `main` dispara `deploy.yml` (Pages) e `deploy-worker.yml` (Worker).

## Próximos passos

1. Configurar a rota `expostacker.com.br/apps/*` no Worker.
2. Vincular `expostacker.com.br` ao Cloudflare Pages quando o DNS estiver active.
3. Substituir os cases mock por conteúdo real e clientes verificáveis.
