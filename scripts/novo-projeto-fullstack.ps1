# ============================================
# EXPOSTACKER — SCRIPT DE NOVO PROJETO FULL-STACK
# Para projetos Next.js com banco de dados, auth, API routes
# Usa Cloudflare Workers + OpenNext (nao Pages)
# ============================================
# Uso:
#   .\scripts\novo-projeto-fullstack.ps1 -Nome "meu-app" -Pasta "C:\PROJETOS\..." -Subdominio "meu" -SupabaseUrl "https://xxx.supabase.co" -SupabaseAnonKey "xxx" -SupabaseServiceKey "xxx"
# ============================================

param(
    [Parameter(Mandatory=$true)]
    [string]$Nome,
    
    [Parameter(Mandatory=$true)]
    [string]$Pasta,
    
    [Parameter(Mandatory=$true)]
    [string]$Subdominio,
    
    [Parameter(Mandatory=$true)]
    [string]$SupabaseUrl,
    
    [Parameter(Mandatory=$true)]
    [string]$SupabaseAnonKey,
    
    [Parameter(Mandatory=$true)]
    [string]$SupabaseServiceKey,
    
    [Parameter(Mandatory=$false)]
    [string]$WorkerName,
    
    [Parameter(Mandatory=$false)]
    [string]$SiteUrl,
    
    [Parameter(Mandatory=$false)]
    [string]$GitHubUser = "lfelipef1dev-jpg"
)

# Defaults
if (-not $WorkerName) { $WorkerName = $Nome }
if (-not $SiteUrl) { $SiteUrl = "https://$Subdominio.expostacker.com.br" }

# Carrega credenciais do .deploy.env
$deployEnv = Join-Path $PSScriptRoot "..\.deploy.env"
if (Test-Path $deployEnv) {
    Get-Content $deployEnv | Where-Object { $_ -match "^[^#].*=" } | ForEach-Object {
        $parts = $_ -split "=", 2
        Set-Variable -Name $parts[0].Trim() -Value $parts[1].Trim()
    }
}

if (-not $CLOUDFLARE_API_TOKEN -or -not $CLOUDFLARE_ACCOUNT_ID -or -not $CLOUDFLARE_ZONE_ID) {
    Write-Host "ERRO: .deploy.env nao encontrado ou sem credenciais" -ForegroundColor Red
    exit 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "EXPOSTACKER — Novo Projeto Full-Stack: $Nome" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Set-Location $Pasta

# 1. Git init
if (-not (Test-Path ".git")) {
    git init
    git branch -M main
}
git config user.email "$GitHubUser@users.noreply.github.com"
git config user.name $GitHubUser

# 2. Criar repo no GitHub
Write-Host "`n[1/7] Criando repo no GitHub..." -ForegroundColor Yellow
gh repo create $Nome --public --source $Pasta --remote origin --push 2>$null
if ($LASTEXITCODE -ne 0) {
    git remote set-url origin "https://github.com/$GitHubUser/$Nome.git"
}
git add -A
git commit -m "Initial commit: $Nome" 2>$null
git push -u origin main 2>$null

# 3. Adicionar secrets no GitHub
Write-Host "[2/7] Adicionando secrets no GitHub..." -ForegroundColor Yellow
$secrets = @{
    "CLOUDFLARE_API_TOKEN" = $CLOUDFLARE_API_TOKEN
    "CLOUDFLARE_ACCOUNT_ID" = $CLOUDFLARE_ACCOUNT_ID
    "NEXT_PUBLIC_SUPABASE_URL" = $SupabaseUrl
    "NEXT_PUBLIC_SUPABASE_ANON_KEY" = $SupabaseAnonKey
    "SUPABASE_SERVICE_ROLE_KEY" = $SupabaseServiceKey
    "NEXT_PUBLIC_SITE_URL" = $SiteUrl
}
foreach ($kv in $secrets.GetEnumerator()) {
    $kv.Value | gh secret set $kv.Key -R "$GitHubUser/$Nome"
    Write-Host "  Secret $($kv.Key): SET" -ForegroundColor Green
}

# 4. Instalar dependencias Cloudflare no projeto
Write-Host "[3/7] Instalando @opennextjs/cloudflare + wrangler..." -ForegroundColor Yellow
npm install @opennextjs/cloudflare@latest wrangler@latest esbuild --save-dev
npm uninstall @netlify/plugin-nextjs 2>$null

# 5. Criar arquivos de configuracao
Write-Host "[4/7] Criando configuracao Cloudflare..." -ForegroundColor Yellow

# wrangler.jsonc
$wranglerConfig = @"
{
  "`$schema": "node_modules/wrangler/config-schema.json",
  "main": ".open-next/worker.js",
  "name": "$WorkerName",
  "compatibility_date": "2024-12-30",
  "compatibility_flags": [
    "nodejs_compat",
    "global_fetch_strictly_public"
  ],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  }
}
"@
$wranglerConfig | Out-File -FilePath "wrangler.jsonc" -Encoding utf8

# open-next.config.ts
$openNextConfig = @"
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});
"@
$openNextConfig | Out-File -FilePath "open-next.config.ts" -Encoding utf8

# .dev.vars
"NEXTJS_ENV=development" | Out-File -FilePath ".dev.vars" -Encoding utf8

# public/_headers
$headers = @"
/_next/static/*
  Cache-Control: public,max-age=31536000,immutable
"@
if (-not (Test-Path "public")) { New-Item -ItemType Directory -Path "public" -Force }
$headers | Out-File -FilePath "public/_headers" -Encoding utf8

# Atualizar .gitignore
$gitignore = Get-Content ".gitignore" -Raw -ErrorAction SilentlyContinue
$gitignoreAdditions = @"

# Cloudflare OpenNext
.open-next
.dev.vars
cloudflare-env.d.ts
.wrangler/
"@
if ($gitignore -and $gitignore -notmatch "\.open-next") {
    $gitignore + $gitignoreAdditions | Out-File -FilePath ".gitignore" -Encoding utf8
}

# 6. Criar workflow
Write-Host "[5/7] Criando GitHub Actions workflow..." -ForegroundColor Yellow
$workflowDir = ".github/workflows"
if (-not (Test-Path $workflowDir)) {
    New-Item -ItemType Directory -Path $workflowDir -Force | Out-Null
}

$workflow = @"
# Deploy $Nome via Cloudflare Workers (full-stack Next.js)
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
          node-version: 22
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Build and Deploy to Cloudflare Workers
        run: npx opennextjs-cloudflare build && npx opennextjs-cloudflare deploy
        env:
          CLOUDFLARE_API_TOKEN: `${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: `${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          NEXT_PUBLIC_SUPABASE_URL: `${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: `${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          SUPABASE_SERVICE_ROLE_KEY: `${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          NEXT_PUBLIC_SITE_URL: `${{ secrets.NEXT_PUBLIC_SITE_URL }}
"@
$workflow | Out-File -FilePath "$workflowDir/deploy.yml" -Encoding utf8

# Commit e push
git add -A
git commit -m "feat: configura deploy via Cloudflare Workers + OpenNext"
git push

# 7. Aguardar deploy e configurar subdominio
Write-Host "[6/7] Aguardando primeiro deploy do GitHub Actions..." -ForegroundColor Yellow
Write-Host "  (Aguardando ate 5 minutos...)" -ForegroundColor DarkGray
Start-Sleep -Seconds 30

$deployed = $false
for ($i = 0; $i -lt 10; $i++) {
    try {
        $checkRes = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/workers/scripts/$WorkerName" -Headers @{Authorization="Bearer $CLOUDFLARE_API_TOKEN"} -ErrorAction Stop
        if ($checkRes.success) {
            $deployed = $true
            Write-Host "  Worker $WorkerName encontrado!" -ForegroundColor Green
            break
        }
    } catch {
        Write-Host "  Aguardando deploy... ($($i+1)/10)" -ForegroundColor DarkGray
        Start-Sleep -Seconds 30
    }
}

if (-not $deployed) {
    Write-Host "  AVISO: Worker ainda nao encontrado. Verifique o GitHub Actions." -ForegroundColor Red
    Write-Host "  Apos o deploy completar, rode o script novamente para configurar o subdominio." -ForegroundColor Yellow
    exit 1
}

# 8. Configurar subdominio
Write-Host "[7/7] Configurando subdominio $Subdominio.expostacker.com.br..." -ForegroundColor Yellow
$domainBody = @{
    environment = "production"
    hostname = "$Subdominio.expostacker.com.br"
    service = $WorkerName
    zone_id = $CLOUDFLARE_ZONE_ID
} | ConvertTo-Json

try {
    $r = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/workers/domains" -Method Put -Headers @{Authorization="Bearer $CLOUDFLARE_API_TOKEN"; "Content-Type"="application/json"} -Body $domainBody
    if ($r.success) {
        Write-Host "  Subdominio configurado!" -ForegroundColor Green
    }
} catch {
    Write-Host "  Erro ao configurar subdominio: $_" -ForegroundColor Red
}

# 9. Setar secrets no Worker (runtime)
Write-Host "`n[8/8] Configurando secrets no Worker (runtime)..." -ForegroundColor Yellow
$workerSecrets = @{
    "SUPABASE_SERVICE_ROLE_KEY" = $SupabaseServiceKey
    "NEXT_PUBLIC_SUPABASE_URL" = $SupabaseUrl
    "NEXT_PUBLIC_SUPABASE_ANON_KEY" = $SupabaseAnonKey
    "NEXT_PUBLIC_SITE_URL" = $SiteUrl
}

foreach ($kv in $workerSecrets.GetEnumerator()) {
    $secretBody = @{ name = $kv.Key; text = $kv.Value; type = "secret_text" } | ConvertTo-Json
    try {
        Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/workers/scripts/$WorkerName/secrets" -Method Put -Headers @{Authorization="Bearer $CLOUDFLARE_API_TOKEN"; "Content-Type"="application/json"} -Body $secretBody | Out-Null
        Write-Host "  Secret $($kv.Key): SET no Worker" -ForegroundColor Green
    } catch {
        Write-Host "  Erro ao setar $($kv.Key): $_" -ForegroundColor Red
    }
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "PROJETO FULL-STACK CONFIGURADO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Repo:      https://github.com/$GitHubUser/$Nome" -ForegroundColor White
Write-Host "Worker:    $WorkerName (Cloudflare Workers)" -ForegroundColor White
Write-Host "Dominio:   https://$Subdominio.expostacker.com.br" -ForegroundColor White
Write-Host "Supabase:  $SupabaseUrl" -ForegroundColor White
Write-Host "`nTodo git push na branch main faz deploy automatico." -ForegroundColor Cyan
Write-Host "Secrets de runtime estao no Worker (nao apenas no GitHub)." -ForegroundColor Cyan
