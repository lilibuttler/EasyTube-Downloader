@echo off
title Iniciar yt-dlp App

REM Entra na pasta do projeto
cd /d C:\yt-dlp-app

REM Inicia o React minimizado
start /MIN "React" cmd /k "npm start"

echo Aguardando o servidor iniciar...

:loop
powershell -Command "try { Invoke-WebRequest http://localhost:3000 -UseBasicParsing | Out-Null; exit 0 } catch { exit 1 }"

if errorlevel 1 (
    timeout /t 2 /nobreak >nul
    goto loop
)

REM Abre o navegador
start "" "http://localhost:3000"

REM Minimiza esta janela também
powershell -Command ^
"$hwnd=(Get-Process -Id $PID).MainWindowHandle; ^
Add-Type '[DllImport(\"user32.dll\")]public static extern bool ShowWindowAsync(System.IntPtr hWnd,int nCmdShow);' -Name Win32 -Namespace Native; ^
[Native.Win32]::ShowWindowAsync($hwnd,2)"

exit