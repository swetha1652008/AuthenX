
@echo off
cd /d "%~dp0"
if not exist node_modules (
    echo Installing project dependencies...
    call npm install
    if errorlevel 1 pause & exit /b 1
)
start "AuthenX Server" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul
start http://localhost:5173/
