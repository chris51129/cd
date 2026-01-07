# Script para corregir encoding UTF-8 corrupto

$files = @(
    "src\components\game\GameRules.tsx",
    "src\components\game\GameArena.tsx",
    "src\components\game\WaitingRoom.tsx",
    "src\components\game\animations\MemoryAnimation.tsx"
)

foreach ($file in $files) {
    Write-Host "Corrigiendo: $file" -ForegroundColor Yellow
    
    # Leer con encoding Latin1 (para leer los bytes corruptos)
    $content = Get-Content $file -Encoding Latin1 -Raw
    
    # Guardar con UTF-8 sin BOM (esto preservará el contenido "corrupto" pero lo escribirá correctamente)
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText((Resolve-Path $file).Path, $content, $utf8NoBom)
    
    Write-Host "  Corregido" -ForegroundColor Green
}

Write-Host "`nEncoding corregido en todos los archivos" -ForegroundColor Cyan
