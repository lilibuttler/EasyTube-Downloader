const WebSocket = require("ws");
const Events = require("../constants/Events");
const Logger = require("../system/Logger");

class SocketServer {
    constructor(server, handlers = {}) {
        this.wss = new WebSocket.Server({ server });
        this.handlers = handlers;
    }

    start() {
        this.wss.on("connection", (ws) => {
            Logger.info("Cliente conectado via WebSocket");

            ws.on("message", async (message) => {
                const socket = this.createSocket(ws);

                try {
                    const data = JSON.parse(message);
                    const action = data.action || "download";

                    if (action === "metadata") {
                        await this.handlers.metadata(data, socket);
                        return;
                    }

                    if (action === "download") {
                        await this.handlers.download(data, socket);
                        return;
                    }

                    socket.error("Ação não reconhecida.");
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

            error: (message) => {
                this.send(ws, Events.DOWNLOAD_ERROR, {
                    message
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