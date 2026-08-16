# ============================================
# EXPOSTACKER — SCRIPT DE NOVO PROJETO
# Cria repo, CNAME, secrets e faz deploy automatico
# ============================================
# REGRA ABSOLUTA: NAO ALTERAR ESTE SCRIPT SEM AUTORIZACAO EXPLICITA.
# Qualquer mudanca aqui pode quebrar o deploy automatico de 100+ projetos.
# ============================================
# Uso:
#   .\scripts\novo-projeto.ps1 -Nome "meu-projeto" -Pasta "C:\PROJETOS\..." -CloudflareProject "meu-projeto" -Subdominio "meu" -Diretorio "out"
# ============================================

param(
    [Parameter(Mandatory=$true)]
    [string]$Nome,

    [Parameter(Mandatory=$true)]
    [string]$Pasta,

    [Parameter(Mandatory=$true)]
    [string]$CloudflareProject,

    [Parameter(Mandatory=$true)]
    [string]$Subdominio,

    [Parameter(Mandatory=$false)]
    [string]$Diretorio = "out",

    [Parameter(Mandatory=$false)]
    [string]$GitHubUser = "lfelipef1dev-jpg"
)

# Carrega credenciais do .deploy.env
$deployEnv = Join-Path $PSScriptRoot "..\.deploy.env"
if (Test-Path $deployEnv) {
    Get-Content $deployEnv | Where-Object { $_ -match "^[^#].*=" } | ForEach-Object {
        $parts = $_ -split "=", 2
        Set-Variable -Name $parts[0].Trim() -Value $parts[1].Trim()
    }
}

if (-not $CLOUDFLARE_API_TOKEN -or -not $CLOUDFLARE_ACCOUNT_ID -or -not $CLOUDFLARE_GLOBAL_KEY) {
    Write-Host 'ERRO: .deploy.env nao encontrado ou sem credenciais' -ForegroundColor Red
    exit 1
}

Write-Host '========================================' -ForegroundColor Cyan
Write-Host ('EXPOSTACKER — Novo Projeto: ' + $Nome) -ForegroundColor Cyan
Write-Host '========================================' -ForegroundColor Cyan

# 1. Git init
Set-Location $Pasta
if (-not (Test-Path ".git")) {
    git init
    git branch -M main
}
git config user.email ($GitHubUser + '@users.noreply.github.com')
git config user.name $GitHubUser

# 2. Criar repo no GitHub
Write-Host "`n[1/5] Criando repo no GitHub..." -ForegroundColor Yellow
gh repo create $Nome --public --source $Pasta --remote origin --push 2>$null
if ($LASTEXITCODE -ne 0) {
    git remote set-url origin ('https://github.com/' + $GitHubUser + '/' + $Nome + '.git')
}
git add -A
git commit -m ('Initial commit: ' + $Nome) 2>$null
git push -u origin main 2>$null

# 3. Adicionar secrets
Write-Host '[2/5] Adicionando secrets no GitHub...' -ForegroundColor Yellow
$CLOUDFLARE_API_TOKEN | gh secret set CLOUDFLARE_API_TOKEN -R ($GitHubUser + '/' + $Nome)
$CLOUDFLARE_ACCOUNT_ID | gh secret set CLOUDFLARE_ACCOUNT_ID -R ($GitHubUser + '/' + $Nome)

# 4. Criar projeto no Cloudflare Pages
Write-Host '[3/5] Criando projeto no Cloudflare Pages...' -ForegroundColor Yellow
$cfHeaders = @{"X-Auth-Email"=$CLOUDFLARE_EMAIL; "X-Auth-Key"=$CLOUDFLARE_GLOBAL_KEY; "Content-Type"="application/json"}
$cfBody = @{ name = $CloudflareProject; production_branch = "main" } | ConvertTo-Json -Compress
try {
    $r = Invoke-RestMethod -Uri ('https://api.cloudflare.com/client/v4/accounts/' + $CLOUDFLARE_ACCOUNT_ID + '/pages/projects') -Method Post -Headers $cfHeaders -Body $cfBody
    Write-Host ('  Projeto criado: ' + $CloudflareProject) -ForegroundColor Green
} catch {
    Write-Host '  Projeto ja existe ou erro (continuando...)' -ForegroundColor DarkYellow
}

# 5. Criar CNAME no DNS + adicionar dominio customizado no Pages
Write-Host '[4/5] Criando CNAME e dominio customizado...' -ForegroundColor Yellow
$cnameBody = @{ type = 'CNAME'; name = $Subdominio; content = ($CloudflareProject + '.pages.dev'); proxied = $true } | ConvertTo-Json -Compress
try {
    $r = Invoke-RestMethod -Uri ('https://api.cloudflare.com/client/v4/zones/' + $CLOUDFLARE_ZONE_ID + '/dns_records') -Method Post -Headers $cfHeaders -Body $cnameBody
    Write-Host ('  CNAME criado: ' + $Subdominio + '.expostacker.com.br') -ForegroundColor Green
} catch {
    Write-Host '  CNAME ja existe ou erro (continuando...)' -ForegroundColor DarkYellow
}

# Adicionar dominio customizado no projeto do Pages
$domainBody = @{ name = ($Subdominio + '.expostacker.com.br') } | ConvertTo-Json -Compress
try {
    $r = Invoke-RestMethod -Uri ('https://api.cloudflare.com/client/v4/accounts/' + $CLOUDFLARE_ACCOUNT_ID + '/pages/projects/' + $CloudflareProject + '/domains') -Method Post -Headers $cfHeaders -Body $domainBody
    Write-Host '  Dominio customizado adicionado no Pages' -ForegroundColor Green
} catch {
    Write-Host '  Dominio customizado ja existe ou erro (continuando...)' -ForegroundColor DarkYellow
}

# 6. Criar workflow se nao existir
Write-Host '[5/5] Configurando workflow...' -ForegroundColor Yellow
$workflowDir = ".github/workflows"
if (-not (Test-Path $workflowDir)) {
    New-Item -ItemType Directory -Path $workflowDir -Force | Out-Null
}
$workflowPath = Join-Path $workflowDir "deploy.yml"
if (-not (Test-Path $workflowPath)) {
    $workflowContent = @(
        'name: CI/CD ' + $Nome,
        '',
        'on:',
        '  push:',
        '    branches:',
        '      - main',
        '',
        'jobs:',
        '  deploy:',
        '    runs-on: ubuntu-latest',
        '    steps:',
        '      - name: Checkout Code',
        '        uses: actions/checkout@v4',
        '',
        '      - name: Setup Node.js',
        '        uses: actions/setup-node@v4',
        '        with:',
        '          node-version: 20',
        "          cache: 'npm'",
        '',
        '      - name: Install Dependencies',
        '        run: npm ci',
        '',
        '      - name: Build Static Site',
        '        run: npm run build',
        '',
        '      - name: Deploy to Cloudflare Pages',
        '        uses: cloudflare/pages-action@v1',
        '        with:',
        '          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}',
        '          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}',
        '          projectName: "' + $CloudflareProject + '"',
        '          directory: "' + $Diretorio + '"'
    )
    Set-Content -Path $workflowPath -Value $workflowContent -Encoding utf8

    git add -A
    git commit -m 'add: GitHub Actions deploy workflow' 2>$null
    git push
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host 'PROJETO CONFIGURADO!' -ForegroundColor Green
Write-Host '========================================' -ForegroundColor Green
Write-Host ('Repo:     https://github.com/' + $GitHubUser + '/' + $Nome) -ForegroundColor White
Write-Host ('Cloudflare: ' + $CloudflareProject + '.pages.dev') -ForegroundColor White
Write-Host ('Dominio:  https://' + $Subdominio + '.expostacker.com.br') -ForegroundColor White
Write-Host 'Todo git push na branch main faz deploy automatico.' -ForegroundColor Cyan
