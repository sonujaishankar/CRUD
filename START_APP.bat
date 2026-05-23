@echo off
title Product Inventory App
color 0A
echo.
echo  ===================================
echo   Starting Product Inventory App...
echo  ===================================
echo.

echo  [1/3] Building Frontend (React)...
cd /d %~dp0frontend
call npm run build

if %ERRORLEVEL% neq 0 (
    echo.
    echo  [ERROR] Frontend build failed!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo  [2/3] Building Backend (NestJS)...
cd /d %~dp0backend
call npm run build

if %ERRORLEVEL% neq 0 (
    echo.
    echo  [ERROR] Backend build failed!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo  [3/3] Starting Application...
echo.
echo  ===================================
echo   Application started successfully!
echo.
echo   Local App URL: http://localhost:3000
echo   API Endpoints: http://localhost:3000/api
echo  ===================================
echo.
echo  Opening browser in 3 seconds...
echo  (Keep this window open to keep the app running!)
echo.

start "" "http://localhost:3000"

node dist/src/main.js
