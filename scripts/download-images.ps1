# Requires PowerShell 5+
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Output directory: project/public/images
$OutDir = Join-Path -Path $PSScriptRoot -ChildPath '..\public\images'
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

# Helper to download if missing or force overwrite
function Download-Image {
  param(
    [Parameter(Mandatory)][string]$Url,
    [Parameter(Mandatory)][string]$FileName
  )
  $dest = Join-Path $OutDir $FileName
  Write-Host "Downloading $FileName ..."
  Invoke-WebRequest -UseBasicParsing -Uri $Url -OutFile $dest
}

# Images to download
$images = @(
  # Hero background (same image currently used inline in Hero.tsx)
  @{ Url = 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1600&q=80'; File = 'hero-bg.jpg' },
  # About section hero image referenced at /images/crafting-workspace.jpg
  @{ Url = 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1600&q=80'; File = 'crafting-workspace.jpg' }
)

foreach ($img in $images) {
  Download-Image -Url $img.Url -FileName $img.File
}

Write-Host "All images downloaded to $OutDir" -ForegroundColor Green
