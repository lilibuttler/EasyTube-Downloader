const Download = require("../models/Download");
const { startDownload } = require("./DownloadEngine");
const Errors = require("../constants/Errors");

function handleDownloadRequest(data, socket) {

    const url = (data.url || "").trim();

    if (!url) {
        socket.error(Errors.INVALID_URL.userMessage);
        return;
    }

    if (!isValidYoutubeUrl(url)) {
        socket.error(Errors.INVALID_URL.userMessage);
        return;
    }

    const download = new Download({
        url,
        format: "mp4",
        quality: "best"
    });

    try {
        startDownload(download, socket);
    } catch (error) {
        console.error(error);
        socket.error(Errors.UNEXPECTED_ERROR.userMessage);
    }
}

function isValidYoutubeUrl(url) {

    return (
        /^https?:\/\/(www\.)?youtube\.com\/watch\?/.test(url) ||
        /^https?:\/\/(www\.)?youtube\.com\/shorts\//.test(url) ||
        /^https?:\/\/youtu\.be\//.test(url)
    );

}

module.exports = {
    handleDownloadRequest
};