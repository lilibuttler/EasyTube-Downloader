@echo off
REM Criar pasta raiz
mkdir yt-dlp-app-v1
cd yt-dlp-app-v1

REM Criar subpasta principal
mkdir yt-dlp-app

cd yt-dlp-app

REM Criar subpastas
mkdir bin
mkdir public
mkdir src
mkdir config

REM Criar arquivos dentro de bin
echo. > bin\yt-dlp.exe
echo. > bin\ffmpeg.exe
echo. > bin\ffprobe.exe

REM Criar arquivos dentro de public
echo. > public\index.html
echo. > public\style.css
echo. > public\app.js

REM Criar arquivos dentro de src
echo. > src\downloadManager.js
echo. > src\componentChecker.js
echo. > src\configManager.js

REM Criar arquivo dentro de config
echo. > config\config.json

REM Criar arquivos na raiz
echo. > server.js
echo. > package.json

echo Estrutura de pastas e arquivos criada com sucesso!
pause
