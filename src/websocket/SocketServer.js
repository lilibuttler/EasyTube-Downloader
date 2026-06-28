const WebSocket = require("ws");
const Events = require("../constants/Events");
const Logger = require("../system/Logger");

class SocketServer {
    constructor(server, downloadHandler) {
        this.wss = new WebSocket.Server({ server });
        this.downloadHandler = downloadHandler;
    }

    start() {
        this.wss.on("connection", (ws) => {
            Logger.info("Cliente conectado via WebSocket");

            ws.on("message", async (message) => {
                try {
                    const data = JSON.parse(message);
                    await this.downloadHandler(data, this.createSocket(ws));
                } catch (error) {
    		    Logger.error(error.message);
    		    this.createSocket(ws).error("Erro ao processar solicitação.");
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