$ErrorActionPreference = 'Stop'
$taskRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
Set-Location -LiteralPath $taskRoot
$remote = (git remote get-url origin).Trim()
if ($LASTEXITCODE -ne 0 -or $remote -ne 'https://github.com/Bluechipwhale/wenlas.git') { throw 'Only the Bluechipwhale/wenlas repository may be packaged' }
$revision = (git rev-parse HEAD).Trim()
if ($LASTEXITCODE -ne 0) { throw 'Commit the verified Wenlas source first' }
$files = @(git ls-tree -r --name-only HEAD)
foreach ($file in $files) {
  if ($file -match '(^|/)(\.git|\.data|node_modules|\.next[^/]*|artifacts|test-results)/' -or ($file -match '(^|/)\.env' -and $file -ne '.env.example')) { throw "Private/generated file in committed source: $file" }
}
$releaseDirectory = Join-Path $taskRoot 'artifacts'
New-Item -ItemType Directory -Path $releaseDirectory -Force | Out-Null
$releasePath = Join-Path $releaseDirectory 'wenlas-hostinger-source.zip'
git archive --format=zip --output=$releasePath HEAD
if ($LASTEXITCODE -ne 0) { throw 'Wenlas source archive failed' }
$hash = (Get-FileHash -LiteralPath $releasePath -Algorithm SHA256).Hash.ToLowerInvariant()
Set-Content -LiteralPath (Join-Path $releaseDirectory 'wenlas-hostinger-source.sha256') -Value "$hash  wenlas-hostinger-source.zip"
Set-Content -LiteralPath (Join-Path $releaseDirectory 'wenlas-hostinger-source.commit') -Value $revision
Write-Output "Verified Wenlas release $revision ($($files.Count) source files)"
Write-Output $releasePath
