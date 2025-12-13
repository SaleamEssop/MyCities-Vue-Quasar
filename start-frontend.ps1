# Start Vue/Quasar Frontend Development Server

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Vue/Quasar Frontend - Dev Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$frontendPath = "C:\MyCities\MyCities-Vue-Quasar"
Set-Location $frontendPath

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "ERROR: node_modules not found!" -ForegroundColor Red
    Write-Host "Please run 'npm install' first." -ForegroundColor Yellow
    exit 1
}

Write-Host "Starting Quasar development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Frontend will be available at: http://localhost:9000" -ForegroundColor Green
Write-Host "(or the port shown in the output below)" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

.\node_modules\.bin\quasar.cmd dev








