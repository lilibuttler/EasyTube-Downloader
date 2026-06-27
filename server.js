const express = require("express");
const path = require("path");
const http = require("http");

const Paths = require("./src/constants/Paths");
const Logger = require("./src/system/Logger");
const SocketServer = require("./src/websocket/SocketServer");
const { handleDownloadRequest } = require("./src/download/DownloadService");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(Paths.PUBLIC));

app.get("/", (req, res) => {
    res.sendFile(path.join(Paths.PUBLIC, "index.html"));
});

const server = http.createServer(app);

const socketServer = new SocketServer(server, handleDownloadRequest);
socketServer.start();

server.listen(PORT, () => {
    Logger.info("EasyTube Downloader iniciado");
    Logger.info(`Acesse: http://localhost:${PORT}`);
});