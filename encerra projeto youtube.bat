@echo off
title Encerrar yt-dlp App

echo Encerrando aplicação...

REM Encerra o servidor Node.js (React)
taskkill /F /IM node.exe >nul 2>&1

REM Encerra processos npm (caso ainda existam)
taskkill /F /IM npm.exe >nul 2>&1
taskkill /F /IM npm.cmd >nul 2>&1

REM Fecha todas as janelas do Prompt de Comando
taskkill /F /IM cmd.exe >nul 2>&1

exit