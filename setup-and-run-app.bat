@echo off
echo ============================================
echo MyCities Vue Quasar - Setup and Run
echo ============================================
echo.

cd /d C:\MyCities\MyCities-Vue-Quasar

echo Step 1: Cleaning npm cache...
call npm cache clean --force

echo.
echo Step 2: Installing dependencies...
call npm install

echo.
echo Step 3: Checking if node_modules exists...
if exist node_modules (
    echo SUCCESS: node_modules directory created
) else (
    echo ERROR: node_modules not created
    echo.
    echo Trying alternative install...
    call npm install --legacy-peer-deps
)

echo.
echo Step 4: Starting development server...
if exist node_modules\.bin\quasar.cmd (
    echo Starting Quasar dev server on port 8080...
    call node_modules\.bin\quasar.cmd dev --port 8080
) else (
    echo ERROR: Quasar CLI not found in node_modules
    echo Trying npm run dev...
    call npm run dev
)

pause




