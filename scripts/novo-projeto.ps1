# ============================================
# EXPOSTACKER — SCRIPT DE NOVO PROJETO
# Cria repo, configura secrets e faz deploy automatico
# ============================================
# Uso:
#   .\scripts\novo-projeto.ps1 -Nome "meu-projeto" -Pasta "C:\PROJETOS\..." -CloudflareProject "meu-projeto" -Diretorio "out"
# ============================================

param(
    [Parameter(Mandatory=$true)]
    [string]$Nome,
    
    [Parameter(Mandatory=$true)]
    [string]$Pasta,
    
    [Parameter(Mandatory=$true)]
    [string]$CloudflareProject,
    
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

if (-not $CLOUDFLARE_API_TOKEN -or -not $CLOUDFLARE_ACCOUNT_ID) {
    Write-Host "ERRO: .deploy.env nao encontrado ou sem credenciais" -ForegroundColor Red
    exit 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "EXPOSTACKER — Novo Projeto: $Nome" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Git init
Set-Location $Pasta
if (-not (Test-Path ".git")) {
    git init
    git branch -M main
}
git config user.email "$GitHubUser@users.noreply.github.com"
git config user.name $GitHubUser

# 2. Criar repo no GitHub
Write-Host "`n[1/4] Criando repo no GitHub..." -ForegroundColor Yellow
gh repo create $Nome --public --source $Pasta --remote origin --push 2>$null
if ($LASTEXITCODE -ne 0) {
    git remote set-url origin "https://github.com/$GitHubUser/$Nome.git"
}
git add -A
git commit -m "Initial commit: $Nome" 2>$null
git push -u origin main 2>$null

# 3. Adicionar secrets
Write-Host "[2/4] Adicionando secrets no GitHub..." -ForegroundColor Yellow
$CLOUDFLARE_API_TOKEN | gh secret set CLOUDFLARE_API_TOKEN -R "$GitHubUser/$Nome"
$CLOUDFLARE_ACCOUNT_ID | gh secret set CLOUDFLARE_ACCOUNT_ID -R "$GitHubUser/$Nome"

# 4. Criar workflow se nao existir
Write-Host "[3/4] Configurando workflow..." -ForegroundColor Yellow
$workflowDir = ".github/workflows"
if (-not (Test-Path $workflowDir)) {
    New-Item -ItemType Directory -Path $workflowDir -Force | Out-Null
}
$workflowPath = Join-Path $workflowDir "deploy.yml"
if (-not (Test-Path $workflowPath)) {
    @"
name: CI/CD $Nome

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Build Static Site
        run: npm run build

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: `${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: `${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: "$CloudflareProject"
          directory: "$Diretorio"
"@ | Out-File -FilePath $workflowPath -Encoding utf8
    
    git add -A
    git commit -m "add: GitHub Actions deploy workflow"
    git push
}

# 5. Deploy
Write-Host "[4/4] Deploy automatico iniciado!" -ForegroundColor Yellow
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "PROJETO CONFIGURADO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Repo: https://github.com/$GitHubUser/$Nome" -ForegroundColor White
Write-Host "Cloudflare: $CloudflareProject" -ForegroundColor White
Write-Host "`nTodo git push na branch main faz deploy automatico." -ForegroundColor Cyan
