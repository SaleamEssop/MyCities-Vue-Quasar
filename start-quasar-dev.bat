@echo off
echo ====================================
echo Starting Quasar Dev Server
echo ====================================
cd /d "C:\MyCities\MyCities-Vue-Quasar"

echo.
echo Installing dependencies if needed...
call npm install

echo.
echo Starting Quasar dev server on port 8080...
call node_modules\.bin\quasar dev --port 8080

pause





