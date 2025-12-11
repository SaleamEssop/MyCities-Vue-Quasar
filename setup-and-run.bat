@echo off
echo ===============================================
echo MyCities Vue-Quasar Setup and Run Script
echo ===============================================
echo.

cd /d "C:\MyCities\MyCities-Vue-Quasar"

echo Current directory: %CD%
echo.

echo Step 1: Checking for node_modules...
if not exist "node_modules" (
    echo node_modules not found. Installing dependencies...
    echo This may take several minutes...
    call npm install
    if errorlevel 1 (
        echo ERROR: npm install failed!
        pause
        exit /b 1
    )
    echo Dependencies installed successfully.
) else (
    echo node_modules already exists.
)

echo.
echo Step 2: Checking for .bin folder...
if not exist "node_modules\.bin" (
    echo .bin folder missing. Reinstalling...
    rmdir /s /q node_modules 2>nul
    call npm install
)

echo.
echo Step 3: Starting Quasar dev server...
echo Access the app at: http://localhost:8080
echo Admin panel at: http://localhost:8080/#/admin
echo.
echo Press Ctrl+C to stop the server
echo.

call node_modules\.bin\quasar.cmd dev --port 8080

pause




