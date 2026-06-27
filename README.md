# EasyTube Downloader

Aplicativo local para baixar vídeos do YouTube em MP4 de forma simples, usando yt-dlp e FFmpeg.

## Objetivo

Criar um aplicativo fácil de usar, com interface simples, sem necessidade de comandos no terminal para o usuário final.

## Funcionalidades atuais

- Baixar vídeos do YouTube em MP4
- Barra de progresso
- Salvamento automático na pasta configurada
- Abertura automática da pasta ao finalizar
- Uso local do yt-dlp e FFmpeg

## Tecnologias

- Node.js
- Express
- WebSocket
- HTML
- CSS
- JavaScript
- yt-dlp
- FFmpeg

## Estrutura do projeto

```text
EasyTube-Downloader
├── bin
├── config
├── docs
├── public
├── src
├── server.js
└── package.json

Como executar
npm install
npm start

Acesse:

http://localhost:3000
Componentes necessários

Os arquivos abaixo devem estar na pasta bin:

yt-dlp.exe
ffmpeg.exe
ffprobe.exe
Roadmap

Consulte docs/roadmap.md.


---

## `CHANGELOG.md`

```md
# Changelog

Todas as mudanças importantes deste projeto serão documentadas aqui.

## [1.0.0] - Em desenvolvimento

### Adicionado

- Download de vídeos em MP4
- Integração com yt-dlp
- Integração com FFmpeg
- Barra de progresso
- Salvamento automático na pasta configurada
- Abertura automática da pasta ao finalizar
- Organização inicial do projeto
- Versionamento no GitHub