@echo off
title Product Inventory App
color 0A
echo.
echo  ===================================
echo   Starting Product Inventory App...
echo  ===================================
echo.

echo  [1/2] Starting Backend (NestJS)...
start "Backend - NestJS" cmd /k "cd /d %~dp0backend && npm run start:dev"

timeout /t 5 /nobreak > nul

echo  [2/2] Starting Frontend (React)...
start "Frontend - React" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 4 /nobreak > nul

echo.
echo  ===================================
echo   Both servers are starting up!
echo.
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:3000/api
echo  ===================================
echo.
echo  Opening browser in 3 seconds...
timeout /t 3 /nobreak > nul

start http://localhost:5173
