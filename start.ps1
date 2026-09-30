# StackLens Quick Launch Script for Windows (PowerShell)
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  StackLens — Website Engineering Intelligence Platform   " -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Start Frontend
Write-Host "`n[1/2] Starting Frontend (React + TypeScript + Vite)..." -ForegroundColor Yellow
Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory "$root\frontend"

Write-Host "`n[2/2] Launching Browser..." -ForegroundColor Yellow
Start-Process "http://localhost:5173"

Write-Host "`nStackLens is active on http://localhost:5173" -ForegroundColor Green
Write-Host "Press Ctrl+C in the terminal windows to stop." -ForegroundColor Gray
