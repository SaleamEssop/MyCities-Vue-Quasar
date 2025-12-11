@echo off
echo ====================================
echo Fixing .git directory and creating admin-reading-panel branch
echo ====================================
echo.
echo This script needs to run as Administrator to fix permission issues.
echo.

cd /d "C:\MyCities\MyCities-Vue-Quasar"

echo Step 1: Checking if .git is problematic...
if exist ".git" (
    echo Found .git - attempting to remove...
    rmdir /s /q .git 2>nul
    if exist ".git" (
        echo WARNING: Could not remove .git directory
        echo Please manually delete C:\MyCities\MyCities-Vue-Quasar\.git
        echo Then run this script again.
        pause
        exit /b 1
    )
    echo .git removed successfully.
)

echo.
echo Step 2: Initializing fresh git repository...
git init
if errorlevel 1 (
    echo ERROR: Failed to initialize git repository
    pause
    exit /b 1
)

echo.
echo Step 3: Creating .gitignore entries...
echo # Dependencies >> .gitignore
echo node_modules/ >> .gitignore
echo. >> .gitignore

echo.
echo Step 4: Adding all files...
git add .

echo.
echo Step 5: Creating initial commit...
git commit -m "Initial commit: MyCities Vue Quasar frontend"

echo.
echo Step 6: Creating admin-reading-panel branch...
git checkout -b admin-reading-panel

echo.
echo ====================================
echo SUCCESS! Git repository initialized.
echo Current branch: admin-reading-panel
echo ====================================
echo.
git status
echo.
pause




