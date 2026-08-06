$ErrorActionPreference = 'Stop'

$root = Resolve-Path (Join-Path $PSScriptRoot '..\..')

# Each entry copies an app-specific `.env.example` (the file each service
# actually validates against at startup) into a sibling `.env`. The root
# `.env.example` is copied separately because `compose.yaml` interpolates
# values from a root-level `.env`, not from any app's own file.
$pairs = @(
  @{ Source = (Join-Path $root '.env.example'); Target = (Join-Path $root '.env') },
  @{ Source = (Join-Path $root 'apps\web\.env.example'); Target = (Join-Path $root 'apps\web\.env') },
  @{ Source = (Join-Path $root 'apps\api-gateway\.env.example'); Target = (Join-Path $root 'apps\api-gateway\.env') },
  @{ Source = (Join-Path $root 'apps\users-service\.env.example'); Target = (Join-Path $root 'apps\users-service\.env') },
  @{ Source = (Join-Path $root 'apps\catalog-service\.env.example'); Target = (Join-Path $root 'apps\catalog-service\.env') },
  @{ Source = (Join-Path $root 'apps\recommendations-service\.env.example'); Target = (Join-Path $root 'apps\recommendations-service\.env') },
  @{ Source = (Join-Path $root 'apps\payments-service\.env.example'); Target = (Join-Path $root 'apps\payments-service\.env') }
)

foreach ($pair in $pairs) {
  if (Test-Path $pair.Target) {
    Write-Host "[SKIP] $($pair.Target) already exists"
    continue
  }

  Copy-Item $pair.Source $pair.Target
  Write-Host "[CREATE] $($pair.Target)"
}

Write-Host 'Local environment files are ready. Review credentials before starting services.'
