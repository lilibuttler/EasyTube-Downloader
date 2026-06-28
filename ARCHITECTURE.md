# Arquitetura

## Visão Geral

O EasyTube Downloader foi desenvolvido utilizando arquitetura modular baseada em responsabilidades.

```
Frontend
      │
      ▼
WebSocket
      │
      ▼
Actions
      │
      ▼
Services
      │
      ▼
Engine
      │
      ▼
Sistema Operacional
```

---

# Estrutura

## actions

Responsável por tratar as ações recebidas pelo WebSocket.

* DownloadAction
* MetadataAction
* FolderAction - Responsável por abrir a pasta configurada de downloads utilizando os recursos do sistema operacional.
* SettingsAction
* HistoryAction

---

## websocket

Gerencia as conexões WebSocket.

Não contém regras de negócio.

---

## download

Responsável pelo processo de download.

* DownloadEngine
* DownloadService
* MetadataService

---

## config

Gerencia configurações da aplicação.

---

## constants

Constantes compartilhadas.

* Events
* Paths

---

## system

Integração com o sistema operacional.

* Logger
* Explorer - Responsável pela integração com o Windows Explorer para abertura da pasta de downloads.

---

## models

Objetos de domínio.

* Download

---

# Princípios

* Uma responsabilidade por arquivo.
* Separação entre frontend e backend.
* Comunicação via WebSocket.
* Nenhum acesso direto do frontend ao sistema operacional.
* Código em inglês.
* Interface em português.
* Arquitetura preparada para evolução.
