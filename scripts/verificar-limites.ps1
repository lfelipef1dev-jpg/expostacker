#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Mostra o uso dos limites do ecossistema Expo Stacker.
.DESCRIPTION
    Conta builds do mes, minutos do GitHub Actions, requisicoes do Workers e projeta sobras.
#>

$ErrorActionPreference = 'Continue'

$GitHubToken = $env:GITHUB_TOKEN
$CFToken = $env:CLOUDFLARE_API_TOKEN
$CFAccount = 'f56a5166f2b120619b0d5c2b5529d6e0'
$CFZone = 'dc7d59daff3d18ded2c749bb712c9105'

if (-not $GitHubToken -or -not $CFToken) {
    Write-Host 'ERRO: configure GITHUB_TOKEN e CLOUDFLARE_API_TOKEN' -ForegroundColor Red
    exit 1
}

$repos = @('expostacker', 'casa-fassi', 'sanatto-facilities', 'seeds-experience')
$startOfMonth = [DateTime]::UtcNow.ToString('yyyy-MM-01T00:00:00Z')
$now = [DateTime]::UtcNow

$totalBuilds = 0
$ghMinutesUsed = 0

foreach ($repo in $repos) {
    $page = 1
    while ($page -le 10) {
        $url = "https://api.github.com/repos/lfelipef1dev-jpg/$repo/actions/runs?per_page=100&page=$page&created=%3E$startOfMonth"
        $res = Invoke-RestMethod -Uri $url -Headers @{ Authorization = "token $GitHubToken" } -Method GET
        if ($res.workflow_runs.Count -eq 0) { break }

        foreach ($run in $res.workflow_runs) {
            if ($run.created_at -ge $startOfMonth -and $run.status -eq 'completed') {
                $totalBuilds++
                if ($run.run_started_at -and $run.updated_at) {
                    $s = [DateTime]::Parse($run.run_started_at)
                    $u = [DateTime]::Parse($run.updated_at)
                    $ghMinutesUsed += [Math]::Max(1, [Math]::Round(($u - $s).TotalMinutes, 0))
                } else {
                    $ghMinutesUsed += 2
                }
            }
        }
        $page++
    }
}

Write-Host '=== USO DO MES ===' -ForegroundColor Cyan
Write-Host "Cloudflare Pages builds: $totalBuilds / 500 ($([Math]::Round(($totalBuilds / 500) * 100, 1))%)" -NoNewline
if ($totalBuilds -gt 400) { Write-Host ' [ATENCAO]' -ForegroundColor Red } else { Write-Host '' }

Write-Host "GitHub Actions minutos: $ghMinutesUsed / 2000 ($([Math]::Round(($ghMinutesUsed / 2000) * 100, 1))%)" -NoNewline
if ($ghMinutesUsed -gt 1600) { Write-Host ' [ATENCAO]' -ForegroundColor Red } else { Write-Host '' }

# Workers requests (simples ping)
try {
    $wRes = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$CFAccount/workers/scripts" -Headers @{ Authorization = "Bearer $CFToken" } -Method GET
    $workers = $wRes.result.id -join ', '
    Write-Host "Workers ativos: $workers"
} catch {
    Write-Host 'Workers: nao foi possivel consultar' -ForegroundColor Yellow
}

# Projetos Pages
try {
    $pRes = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$CFAccount/pages/projects" -Headers @{ Authorization = "Bearer $CFToken" } -Method GET
    $pages = ($pRes.result | ForEach-Object { $_.name }) -join ', '
    Write-Host "Cloudflare Pages: $pages"
} catch {
    Write-Host 'Cloudflare Pages: nao foi possivel consultar' -ForegroundColor Yellow
}

Write-Host ''
Write-Host '=== PROJECAO ===' -ForegroundColor Cyan
$buildsRestantes = 500 - $totalBuilds
$minRestantes = 2000 - $ghMinutesUsed
$estimativaNovosParados = [Math]::Floor($buildsRestantes / 1)
$estimativaNovosAtivos = [Math]::Floor($buildsRestantes / (2 * 30))  # 2 deploys/dia

Write-Host "Builds sobrando: $buildsRestantes"
Write-Host "Minutos sobrando: $minRestantes"
Write-Host "Novos projetos parados: ~$estimativaNovosParados"
Write-Host "Novos projetos ativos (2x/dia): ~$estimativaNovosAtivos"
