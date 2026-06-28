const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const Paths = require("../constants/Paths");
const Logger = require("../system/Logger");
const { parseProgress } = require("./ProgressParser");
const { getDownloadFolder } = require("../config/ConfigService");

const DownloadManager = require("./DownloadManager");

function startDownload(download, socket) {
    const downloadFolder = getDownloadFolder();

    if (!fs.existsSync(downloadFolder)) {
        fs.mkdirSync(downloadFolder, { recursive: true });
    }

    if (!fs.existsSync(Paths.YT_DLP)) {
        socket.error("yt-dlp.exe não encontrado na pasta bin.");
        return;
    }

    if (!fs.existsSync(Paths.FFMPEG)) {
        socket.error("ffmpeg.exe não encontrado na pasta bin.");
        return;
    }

    Logger.info(`Iniciando download: ${download.url}`);

    socket.started();
    download.start();

    const outputTemplate = path.join(downloadFolder, "%(title)s.%(ext)s");

    const args = [
        "--newline",
        "--windows-filenames",
        "-f",
        "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/best",
        "-o",
        outputTemplate,
        download.url
    ];

    const beforeFiles = getMediaFiles(downloadFolder);

    const yt = spawn(Paths.YT_DLP, args, {
        cwd: Paths.ROOT,
        windowsHide: true,
        env: {
            ...process.env,
            PATH: `${Paths.BIN};${process.env.PATH}`
        }
    });

    DownloadManager.register(download.id, yt);

    yt.stdout.on("data", (data) => {
        const text = data.toString();
        Logger.info(text);

        const progress = parseProgress(text);
        if (progress) socket.progress(progress);
    });

    yt.stderr.on("data", (data) => {
        const text = data.toString();
        Logger.error(text);

        const progress = parseProgress(text);
        if (progress) socket.progress(progress);
    });

    yt.on("close", async (code) => {
    if (DownloadManager.isCancelled(download.id)) {
        DownloadManager.unregister(download.id);

        download.fail();
        Logger.info("Download cancelado pelo usuário.");

        return;
    }

    DownloadManager.unregister(download.id);

    if (code !== 0) {
        download.fail();
        Logger.error(`Download finalizado com erro. Código: ${code}`);
        socket.error("Não foi possível baixar este vídeo.");
        return;
    }

    try {
        await mergeIfNeeded(downloadFolder, beforeFiles);

        download.complete();
        Logger.info("Download concluído.");

        socket.completed(downloadFolder);
    } catch (error) {
        download.fail();
        Logger.error(error.message);
        socket.error("O vídeo foi baixado, mas não foi possível finalizar o MP4.");
    }
});

    yt.on("error", (err) => {
        download.fail();
        Logger.error(`Erro no spawn: ${err.message}`);
        socket.error("Erro ao iniciar o mecanismo de download.");
    });
}

function getMediaFiles(folder) {
    if (!fs.existsSync(folder)) return [];

    return fs.readdirSync(folder)
        .filter(file =>
            file.toLowerCase().endsWith(".mp4") ||
            file.toLowerCase().endsWith(".m4a") ||
            file.toLowerCase().endsWith(".webm")
        )
        .map(file => path.join(folder, file));
}

async function mergeIfNeeded(folder, beforeFiles) {
    const afterFiles = getMediaFiles(folder);
    const newFiles = afterFiles.filter(file => !beforeFiles.includes(file));

    const audioFiles = newFiles.filter(file =>
        file.toLowerCase().endsWith(".m4a") ||
        file.toLowerCase().endsWith(".webm")
    );

    const videoFiles = newFiles.filter(file =>
        file.toLowerCase().endsWith(".mp4")
    );

    if (audioFiles.length === 0 || videoFiles.length === 0) {
        return;
    }

    const videoFile = videoFiles[0];
    const audioFile = audioFiles[0];

    const finalFile = videoFile
        .replace(/\.f\d+\.mp4$/i, ".mp4")
        .replace(/\.mp4$/i, ".final.mp4");

    await runFfmpegMerge(videoFile, audioFile, finalFile);

    fs.unlinkSync(videoFile);
    fs.unlinkSync(audioFile);

    const cleanFinalFile = finalFile.replace(/\.final\.mp4$/i, ".mp4");

    if (fs.existsSync(cleanFinalFile)) {
        fs.unlinkSync(cleanFinalFile);
    }

    fs.renameSync(finalFile, cleanFinalFile);
}

function runFfmpegMerge(videoFile, audioFile, outputFile) {
    return new Promise((resolve, reject) => {
        const command = [
            `"${Paths.FFMPEG}"`,
            "-y",
            "-i", `"${videoFile}"`,
            "-i", `"${audioFile}"`,
            "-c:v", "copy",
            "-c:a", "aac",
            "-shortest",
            `"${outputFile}"`
        ].join(" ");

        Logger.info(`Comando FFmpeg: ${command}`);

        const ffmpeg = spawn(command, {
            cwd: Paths.ROOT,
            shell: true,
            windowsHide: true,
            env: {
                ...process.env,
                PATH: `${Paths.BIN};${process.env.PATH}`
            }
        });

        ffmpeg.stderr.on("data", (data) => {
            Logger.info(data.toString());
        });

        ffmpeg.on("close", (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`FFmpeg finalizou com erro. Código: ${code}`));
            }
        });

        ffmpeg.on("error", (err) => {
            reject(err);
        });
    });
}

module.exports = {
    startDownload
};