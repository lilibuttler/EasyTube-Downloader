const { handleDownloadRequest } = require("../download/DownloadService");

async function handle(data, socket) {
    await handleDownloadRequest(data, socket);
}

module.exports = {
    handle
};