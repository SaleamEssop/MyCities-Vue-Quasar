@echo off
title MyCities Vue Quasar - Install and Run
color 0A

echo ================================================
echo   MyCities Vue Quasar - Installation and Setup
echo ================================================
echo.

cd /d "C:\MyCities\MyCities-Vue-Quasar"
echo Current directory: %CD%
echo.

echo [Step 1/4] Checking Node and NPM versions...
echo.
node --version
npm --version
echo.

echo [Step 2/4] Deleting old node_modules if exists...
if exist node_modules (
    echo Removing node_modules...
    rmdir /s /q node_modules
)
if exist package-lock.json (
    echo Removing package-lock.json...
    del package-lock.json
)
echo Done.
echo.

echo [Step 3/4] Installing dependencies (this may take a few minutes)...
echo.
call npm install
if errorlevel 1 (
    echo.
    echo ERROR: npm install failed. Trying with legacy-peer-deps...
    call npm install --legacy-peer-deps
)
echo.

echo [Step 4/4] Checking installation...
if exist "node_modules\.bin\quasar.cmd" (
    echo.
    echo SUCCESS! Dependencies installed.
    echo.
    echo Starting development server on port 8080...
    echo.
    echo Open http://localhost:8080 in your browser
    echo Press Ctrl+C to stop the server
    echo.
    call node_modules\.bin\quasar.cmd dev --port 8080
) else (
    echo.
    echo ERROR: Quasar CLI not found after installation.
    echo Please check your npm configuration.
    echo.
    echo Try running these commands manually:
    echo   1. npm cache clean --force
    echo   2. npm install
    echo.
)

pause




