# Arquitetura

## Visão geral

O EasyTube Downloader é uma aplicação local composta por uma interface web e um backend Node.js.

A interface envia o link do YouTube para o backend usando WebSocket. O backend executa o yt-dlp, acompanha o progresso e retorna as atualizações para a interface.

## Fluxo principal

```text
Usuário
↓
Interface HTML/CSS/JS
↓
WebSocket
↓
server.js
↓
downloadManager.js
↓
yt-dlp.exe
↓
ffmpeg.exe
↓
Arquivo MP4 final


Responsabilidades
server.js

Responsável por iniciar o servidor, servir a interface e receber conexões WebSocket.

src/configManager.js

Responsável por ler configurações do projeto, como pasta padrão de download.

src/componentChecker.js

Responsável por verificar se yt-dlp.exe, ffmpeg.exe e ffprobe.exe existem na pasta bin.

src/downloadManager.js

Responsável por executar o yt-dlp, processar o progresso e finalizar o download.

Pasta bin

Contém os executáveis externos usados pela aplicação:

yt-dlp.exe
ffmpeg.exe
ffprobe.exe

Esses arquivos não devem ser versionados no GitHub.

Pasta public

Contém a interface do usuário.

Pasta config

Contém arquivos de configuração persistente.


---

## `docs/wireframes.md`

```md
# Wireframes

## Tela inicial

```text
┌──────────────────────────────────────────┐
│ EasyTube Downloader                      │
│                                          │
│ Cole o link do YouTube                   │
│ ┌──────────────────────────────────────┐ │
│ │ https://youtube.com/...              │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ [ Baixar vídeo ]                         │
└──────────────────────────────────────────┘

Download em andamento

┌──────────────────────────────────────────┐
│ Baixando vídeo...                        │
│                                          │
│ ███████████████░░░░░░░ 68%               │
│                                          │
│ Velocidade: 12 MB/s                      │
│ Tempo restante: 00:08                    │
└──────────────────────────────────────────┘

Download concluído

┌──────────────────────────────────────────┐
│ Download concluído                       │
│                                          │
│ O vídeo foi salvo na pasta configurada.  │
│                                          │
│ [ Abrir pasta ] [ Baixar outro ]         │
└──────────────────────────────────────────┘


---

## `.gitignore`

```gitignore
node_modules/
downloads/
logs/
*.log
.env

bin/yt-dlp.exe
bin/ffmpeg.exe
bin/ffprobe.exe
bin/aria2c.exe

.DS_Store
Thumbs.db