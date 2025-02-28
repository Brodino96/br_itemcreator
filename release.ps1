$projectName = Split-Path -Leaf (Get-Location)

$releaseRoot = "$PSScriptRoot\release"
$releaseFolder = "$releaseRoot\$projectName"

if (!(Test-Path $releaseRoot)) {
    New-Item -ItemType Directory -Path $releaseRoot | Out-Null
}

if (Test-Path $releaseFolder) {
    Remove-Item -Recurse -Force $releaseFolder
}
New-Item -ItemType Directory -Path $releaseFolder | Out-Null

Write-Host "Building project..."
bun run dev

Write-Host "Copying dist folder..."
Copy-Item -Path "$PSScriptRoot\dist" -Destination "$releaseFolder\dist" -Recurse -Force

Write-Host "Copying necessary files..."
Copy-Item -Path "$PSScriptRoot\src\fxmanifest.lua" -Destination "$releaseFolder\fxmanifest.lua" -Force
Copy-Item -Path "$PSScriptRoot\src\config.json" -Destination "$releaseFolder\config.json" -Force

$zipFile = "$releaseRoot\$projectName.zip"

if (Test-Path $zipFile) {
    Remove-Item $zipFile -Force
}

Write-Host "Creating ZIP archive..."
Compress-Archive -Path "$releaseFolder\*" -DestinationPath $zipFile -Force

Write-Host "Release package created: $zipFile"
