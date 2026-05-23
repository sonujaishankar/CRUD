@echo off
title Product Inventory App
color 0A
echo.
echo  ===================================
echo   Starting Product Inventory App...
echo  ===================================
echo.

echo  [1/2] Building Frontend (React)...
cd /d %~dp0frontend
call npm run build

if %ERRORLEVEL% neq 0 (
    echo.
    echo  ❌ Frontend build failed! Cannot start application.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo  [2/2] Starting Backend (NestJS)...
start "Backend - NestJS" cmd /k "cd /d %~dp0backend && npm run start:dev"

timeout /t 5 /nobreak > nul

echo.
echo  ===================================
echo   Application started successfully!
echo.
echo   Local App URL: http://localhost:3000
echo   API Endpoints: http://localhost:3000/api
echo  ===================================
echo.
echo  Opening browser in 3 seconds...
timeout /t 3 /nobreak > nul

start http://localhost:3000
