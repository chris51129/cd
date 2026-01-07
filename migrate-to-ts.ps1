# TypeScript Migration Script
# Converts .jsx/.js files to .tsx/.ts with basic type annotations

param(
    [string]$SourceDir = "src",
    [switch]$DryRun = $false
)

Write-Host "=== CryptoDuels TypeScript Migration Script ===" -ForegroundColor Cyan
Write-Host ""

# Find all .jsx and .js files (excluding tests, mocks, and already migrated files)
$filesToMigrate = Get-ChildItem -Path $SourceDir -Recurse -Include *.jsx,*.js -Exclude *.test.js,*.test.jsx,*.spec.js,*.config.js,setupTests.js | 
    Where-Object { 
        $_.DirectoryName -notmatch '\\__mocks__' -and
        $_.DirectoryName -notmatch 'node_modules'
    }

Write-Host "Found $($filesToMigrate.Count) files to migrate" -ForegroundColor Yellow
Write-Host ""

foreach ($file in $filesToMigrate) {
    $relativePath = $file.FullName.Replace((Get-Location).Path + "\", "")
    
    # Determine new extension
    $newExtension = if ($file.Extension -eq ".jsx") { ".tsx" } else { ".ts" }
    $newPath = $file.FullName -replace '\.(jsx|js)$', $newExtension
    
    Write-Host "Processing: $relativePath" -ForegroundColor Green
    
    if (-not $DryRun) {
        # Read content
        $content = Get-Content -Path $file.FullName -Raw
        
        # Basic transformations
        $content = $content -replace "import PropTypes from 'prop-types';", ""
        $content = $content -replace 'import PropTypes from "prop-types";', ""
        
        # Remove PropTypes definitions (multiline)
        $content = $content -replace "(?s)\n\w+\.propTypes\s*=\s*\{[^}]*\};?\s*", ""
        
        # Write to new file
        Set-Content -Path $newPath -Value $content -NoNewline
        
        # Remove old file
        Remove-Item -Path $file.FullName -Force
        
        $newRelative = $newPath.Replace((Get-Location).Path + "\", "")
        Write-Host "  Migrated to: $newRelative" -ForegroundColor DarkGreen
    } else {
        $newRelative = $newPath.Replace((Get-Location).Path + "\", "")
        Write-Host "  [DRY RUN] Would migrate to: $newRelative" -ForegroundColor DarkYellow
    }
}

Write-Host ""
Write-Host "Migration complete!" -ForegroundColor Cyan
