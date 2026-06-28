const WebSocket = require("ws");
const Events = require("../constants/Events");
const Logger = require("../system/Logger");

const DownloadAction = require("../actions/DownloadAction");
const MetadataAction = require("../actions/MetadataAction");
const FolderAction = require("../actions/FolderAction");
const SettingsAction = require("../actions/SettingsAction");
const HistoryAction = require("../actions/HistoryAction");
const CancelDownloadAction = require("../actions/CancelDownloadAction");

class SocketServer {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });

        this.actions = {
            download: DownloadAction.handle,
            "cancel-download": CancelDownloadAction.handle,
            metadata: MetadataAction.handle,
            "open-folder": FolderAction.handle,
            settings: SettingsAction.handle,
            history: HistoryAction.handle
        };
    }

    start() {
        this.wss.on("connection", (ws) => {
            Logger.info("Cliente conectado via WebSocket");

            ws.on("message", async (message) => {
                const socket = this.createSocket(ws);

                try {
                    const data = JSON.parse(message);
                    const action = data.action || "download";

                    if (!this.actions[action]) {
                        socket.error("Ação não reconhecida.");
                        return;
                    }

                    await this.actions[action](data, socket);
                } catch (error) {
                    Logger.error(error.message);
                    socket.error("Erro ao processar solicitação.");
                }
            });
        });
    }

    createSocket(ws) {
        return {
            started: () => {
                this.send(ws, Events.DOWNLOAD_STARTED, {
                    message: "Download iniciado."
                });
            },

            progress: (progress) => {
                this.send(ws, Events.DOWNLOAD_PROGRESS, progress);
            },

            completed: (folder) => {
                this.send(ws, Events.DOWNLOAD_COMPLETED, {
                    message: "Download concluído.",
                    folder
                });
            },

            metadata: (video) => {
                this.send(ws, Events.METADATA_LOADED, {
                    video
                });
            },

            folderOpened: (folder) => {
                this.send(ws, Events.FOLDER_OPENED, {
                    folder
                });
            },

            settingsLoaded: (settings) => {
                this.send(ws, Events.SETTINGS_LOADED, {
                    settings
                });
            },

            historyLoaded: (history) => {
                this.send(ws, Events.HISTORY_LOADED, {
                    history
                });
            },

            error: (message) => {
                this.send(ws, Events.DOWNLOAD_ERROR, {
                    message
                });
            },

            cancelled: () => {
                this.send(ws, Events.DOWNLOAD_CANCELLED, {
                    message: "Download cancelado."
                });
            }
        };
    }

    send(ws, type, payload = {}) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type,
                ...payload
            }));
        }
    }
}

module.exports = SocketServer;