# PENDENTE — O que falta para subir 100% no Google/Bing

> URGENTE
> Status: aguardando credenciais externas
> Última revisão: 28/08/2026

---

## Resumo

O site `expostacker.com.br` está **no ar, validado e tecnicamente pronto**. Tudo que depende de código já foi feito.

O que falta são **3 contas/verificações externas**. Sem elas, GA4, GSC e Bing não conseguem ser ativados automaticamente, porque o repositório não possui os tokens necessários.

---

## 1. Google Analytics 4 (GA4)

### O que é
Métricas de acesso, origem de tráfego, conversões e comportamento dos visitantes.

### Como criar
1. Acesse [https://analytics.google.com](https://analytics.google.com)
2. Crie uma nova propriedade para `expostacker.com.br`
3. Copie o **Measurement ID** (formato `G-XXXXXXXXXX`)

### Onde colocar
- Adicionar como **GitHub Secret** com o nome `PUBLIC_GA4_ID`
- Ou informar o valor para ser setado via `gh secret set`

### O que ativa no site
- Tag do GA4 em todas as páginas
- Eventos: `whatsapp_click`, `email_click`, `generate_lead`

---

## 2. Google Search Console (GSC)

### O que é
Verificação de propriedade do domínio, submissão de sitemap e monitoramento de indexação.

### Como criar
1. Acesse [https://search.google.com/search-console](https://search.google.com/search-console)
2. Adicione a propriedade `expostacker.com.br`
3. Escolha o método **Meta tag** (HTML) de verificação
4. Copie o conteúdo do `content` da meta tag `google-site-verification`

### Onde colocar
- Adicionar como **GitHub Secret** com o nome `PUBLIC_GSC_TOKEN`
- Ou informar o valor para ser setado via `gh secret set`

### O que ativa no site
- `<meta name="google-site-verification" content="TOKEN">` no `<head>`

### Próximo passo manual após verificação
- Submeter `https://expostacker.com.br/sitemap-index.xml` no GSC

---

## 3. Bing Webmaster Tools

### O que é
Versão do Search Console para Bing/IA do Microsoft. Ajuda a aparecer no Copilot/Bing Chat.

### Como criar
1. Acesse [https://www.bing.com/webmasters](https://www.bing.com/webmasters)
2. Adicione o site `expostacker.com.br`
3. Escolha o método **Meta tag** (HTML) de verificação
4. Copie o conteúdo do `content` da meta tag `msvalidate.01`

### Onde colocar
- Adicionar como **GitHub Secret** com o nome `PUBLIC_BING_TOKEN`
- Ou informar o valor para ser setado via `gh secret set`

### O que ativa no site
- `<meta name="msvalidate.01" content="TOKEN">` no `<head>`

### Próximo passo manual após verificação
- Submeter `https://expostacker.com.br/sitemap-index.xml` no Bing

---

## Código já preparado

O repositório já consome esses valores automaticamente:

- `src/components/BaseHead.astro` lê `PUBLIC_GA4_ID`, `PUBLIC_GSC_TOKEN` e `PUBLIC_BING_TOKEN`
- `.github/workflows/deploy.yml` passa esses `secrets` para o build
- `npm run build` e `git push` na `main` fazem o deploy automático

## Como finalizar

1. Criar as 3 contas/propriedades acima
2. Copiar os 3 tokens
3. Setar como GitHub Secrets em: `Settings > Secrets and variables > Actions`
4. Fazer push para `main` ou avisar Devin para fazer o deploy

---

## Nota de segurança

Esses três valores **não devem ser commitados no repositório**. Só podem ficar no GitHub Secrets ou em `.deploy.env` (já gitignored). Nunca versionar.
