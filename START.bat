@echo off
setlocal
cd /d "%~dp0"

echo.
echo ========================================
echo   Plex Music Web Prototype
echo ========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed yet.
  echo Install the LTS version from https://nodejs.org/
  echo Then double-click START.bat again.
  echo.
  pause
  exit /b 1
)

if not exist node_modules (
  echo First run: installing app packages...
  echo This can take a few minutes.
  echo.
  call npm install
  if errorlevel 1 (
    echo.
    echo Installation failed. Send a screenshot of this window for help.
    pause
    exit /b 1
  )
)

echo Starting the app...
start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:5173"
call npm run dev
