const { spawn, exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const Paths = require("../constants/Paths");
const Logger = require("../system/Logger");
const { parseProgress } = require("./ProgressParser");

function startDownload(download, socket) {
    if (!fs.existsSync(Paths.DOWNLOADS)) {
        fs.mkdirSync(Paths.DOWNLOADS, { recursive: true });
    }

    if (!fs.existsSync(Paths.YT_DLP)) {
        socket.error("yt-dlp.exe não encontrado na pasta bin.");
        return;
    }

    if (!fs.existsSync(Paths.FFMPEG)) {
        socket.error("ffmpeg.exe não encontrado na pasta bin.");
        return;
    }

    socket.started();
    download.start();

    const args = [
        "--ffmpeg-location",
        Paths.FFMPEG_DIR,

        "-f",
        "bv*+ba/b",

        "--merge-output-format",
        "mp4",

        "--newline",

        "--windows-filenames",

        "-o",
        path.join(Paths.DOWNLOADS, "%(title)s.%(ext)s"),

        download.url
    ];

    const yt = spawn(Paths.YT_DLP, args);

    yt.stdout.on("data", (data) => {
        const progress = parseProgress(data.toString());

        if (progress) {
            socket.progress(progress);
        }
    });

    yt.stderr.on("data", (data) => {
        const progress = parseProgress(data.toString());

        if (progress) {
            socket.progress(progress);
        }
    });

    yt.on("close", (code) => {
        if (code === 0) {
            download.complete();
            exec(`explorer "${Paths.DOWNLOADS}"`);
            socket.completed(Paths.DOWNLOADS);
        } else {
            download.fail();
            Logger.error("Download finalizado com erro.");
            socket.error("Não foi possível baixar este vídeo.");
        }
    });

    yt.on("error", () => {
        download.fail();
        socket.error("Erro ao iniciar o yt-dlp.");
    });
}

module.exports = {
    startDownload
};