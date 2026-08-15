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

1. Criar projeto no Cloudflare Pages e configurar os secrets `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` no GitHub.
2. Configurar a rota `expostacker.com.br/apps/*` no Worker para apontar para `expostacker-worker`.
3. Publicar o conteúdo real dos cases e substituir os dados mock por clientes reais.
