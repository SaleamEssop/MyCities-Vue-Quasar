@echo off
echo ====================================
echo Starting both Laravel and Quasar Dev Servers
echo ====================================
echo.
echo Starting Laravel on port 9000...
start "Laravel Server" cmd /c "cd /d C:\MyCities\MyCities-Server-Admin---Laravel && php artisan serve --port=9000"

timeout /t 3 /nobreak > nul

echo Starting Quasar on port 8080...
start "Quasar Server" cmd /c "cd /d C:\MyCities\MyCities-Vue-Quasar && npx quasar dev --port 8080"

echo.
echo ====================================
echo Both servers started in separate windows.
echo Laravel: http://localhost:9000
echo Quasar:  http://localhost:8080
echo ====================================
echo.
pause




