$ErrorActionPreference = 'Stop'

$checks = @(
  @{ Name = 'API Gateway'; Uri = 'http://localhost:3000/api/v1/health/live' },
  @{ Name = 'Users'; Uri = 'http://localhost:3001/health/live' },
  @{ Name = 'Catalog'; Uri = 'http://localhost:3002/health/live' },
  @{ Name = 'Recommendations'; Uri = 'http://localhost:3003/health/live' },
  @{ Name = 'Web'; Uri = 'http://localhost:5173' }
)

foreach ($check in $checks) {
  try {
    $response = Invoke-WebRequest -Uri $check.Uri -UseBasicParsing -TimeoutSec 5
    Write-Host ("[OK] {0}: HTTP {1}" -f $check.Name, $response.StatusCode)
  }
  catch {
    Write-Error ("[FAIL] {0}: {1}" -f $check.Name, $_.Exception.Message)
  }
}
