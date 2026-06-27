const express = require("express");
const path = require("path");
const http = require("http");
const WebSocket = require("ws");

const { checkComponents } = require("./src/componentChecker");
const { startDownload } = require("./src/downloadManager");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const status = checkComponents();

if (!status.ok) {

    console.log("");
    console.log("========================================");
    console.log("Componentes ausentes");
    console.log("========================================");

    status.missing.forEach(item => {

        console.log(item.component);
        console.log(item.path);
        console.log("");

    });

} else {

    console.log("");
    console.log("========================================");
    console.log("Todos os componentes encontrados");
    console.log("========================================");
    console.log("");

}

wss.on("connection", (ws) => {

    console.log("Cliente conectado");

    ws.on("message", (message) => {

        try {

            const { url } = JSON.parse(message);

            startDownload(url, ws);

        } catch {

            ws.send(JSON.stringify({

                type: "error",

                message: "Link inválido."

            }));

        }

    });

});

server.listen(PORT, () => {

    console.log("========================================");
    console.log("YouTube Downloader");
    console.log("========================================");
    console.log(`Servidor iniciado em http://localhost:${PORT}`);
    console.log("");

});