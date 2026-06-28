# 🚀 EasyTube Downloader

Aplicativo desktop desenvolvido em **Node.js** para download de vídeos do YouTube em MP4 utilizando **yt-dlp** e **FFmpeg**, com interface moderna e foco na simplicidade de uso.

---

# Objetivo

Criar um aplicativo rápido, leve e intuitivo para download de vídeos do YouTube, eliminando a necessidade de utilizar comandos em terminal.

O projeto foi desenvolvido com arquitetura modular para facilitar manutenção, evolução e futuras funcionalidades.

---

# Funcionalidades

## Disponíveis

* Download de vídeos em MP4
* Pré-visualização do vídeo antes do download
* Miniatura do vídeo
* Exibição do título, canal e duração
* Barra de progresso em tempo real
* Exibição de velocidade, tamanho e tempo restante
* Integração com yt-dlp
* Integração com FFmpeg
* Configuração automática da pasta padrão
* Arquitetura modular baseada em responsabilidades
* Comunicação em tempo real via WebSocket
* Botão para abrir a pasta de download após a conclusão
* Cancelamento de downloads em andamento

---

# Tecnologias

* Node.js
* Express
* WebSocket
* HTML5
* CSS3
* JavaScript
* yt-dlp
* FFmpeg

---

# Estrutura do Projeto

```text
EasyTube Downloader
│
├── bin
│   ├── yt-dlp.exe
│   ├── ffmpeg.exe
│   └── ffprobe.exe
│
├── config
│
├── public
│   ├── css
│   ├── js
│   └── index.html
│
├── src
│   ├── actions
│   ├── config
│   ├── constants
│   ├── download
│   ├── models
│   ├── system
│   └── websocket
│
├── ARCHITECTURE.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── ROADMAP.md
├── README.md
├── package.json
└── server.js
```

---

# Como executar

## Instalar dependências

```bash
npm install
```

## Executar

```bash
npm start
```

Acesse:

```
http://localhost:3000
```

---

# Dependências externas

Os seguintes arquivos devem existir na pasta **bin**:

* yt-dlp.exe
* ffmpeg.exe
* ffprobe.exe

---

# Documentação

* README.md
* ROADMAP.md
* CHANGELOG.md
* ARCHITECTURE.md
* CONTRIBUTING.md

---

# Licença

Projeto desenvolvido para fins de estudo e uso pessoal.
