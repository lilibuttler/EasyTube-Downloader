const Download = require("../models/Download");
const { startDownload } = require("./DownloadEngine");

function handleDownloadRequest(data, socket) {
    const url = data.url;

    if (!url || !isValidYoutubeUrl(url)) {
        socket.error("Cole um link válido do YouTube.");
        return;
    }

    const download = new Download({
        url,
        format: "mp4",
        quality: "best"
    });

    startDownload(download, socket);
}

function isValidYoutubeUrl(url) {
    return (
        url.includes("youtube.com/watch") ||
        url.includes("youtube.com/shorts") ||
        url.includes("youtu.be/")
    );
}

module.exports = {
    handleDownloadRequest
};