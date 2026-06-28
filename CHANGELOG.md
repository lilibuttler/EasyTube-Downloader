# Changelog

Todas as alterações relevantes deste projeto serão registradas neste documento.

---

# [1.0.0] - Em desenvolvimento

## Added

* Estrutura inicial do projeto
* Download de vídeos utilizando yt-dlp
* Integração com FFmpeg
* Barra de progresso em tempo real
* Comunicação via WebSocket
* Interface moderna
* Pré-visualização do vídeo
* Exibição da miniatura
* Exibição do título do vídeo
* Exibição do canal
* Exibição da duração
* Configuração automática da pasta de download
* Organização modular da arquitetura
* Versionamento utilizando Git e GitHub

## Changed

* Interface redesenhada
* Fluxo de download aprimorado
* Pasta padrão alterada para Vídeos do usuário

## Refactored

* Separação das Actions
* Refatoração do SocketServer
* Criação da camada System
* Centralização dos caminhos em Paths
* Centralização das configurações em ConfigService

## Fixed

* Correção da integração com FFmpeg
* Correção do merge dos arquivos MP4
* Correção da detecção da pasta do usuário
* Correção da exibição do preview
* Correção do carregamento dos metadados

### Added

- Botão "Abrir pasta" após a conclusão do download.

### Changed

- Removida a abertura automática do Windows Explorer ao finalizar o download.
- O usuário passa a controlar quando abrir a pasta de destino.