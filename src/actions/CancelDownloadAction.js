const DownloadManager = require("../download/DownloadManager");

async function handle(data, socket) {
    const cancelled = DownloadManager.cancelCurrent();

    if (!cancelled) {
        socket.error("Nenhum download em andamento para cancelar.");
        return;
    }

    socket.cancelled();
}

module.exports = {
    handle
};