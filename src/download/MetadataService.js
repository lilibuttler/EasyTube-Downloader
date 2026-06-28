const { spawn } = require("child_process");

const Paths = require("../constants/Paths");
const Logger = require("../system/Logger");

function getVideoMetadata(url) {
    return new Promise((resolve, reject) => {
        const args = [
            "--dump-json",
            "--no-playlist",
            url
        ];

        const yt = spawn(Paths.YT_DLP, args, {
            cwd: Paths.ROOT,
            windowsHide: true,
            env: {
                ...process.env,
                PATH: `${Paths.BIN};${process.env.PATH}`
            }
        });

        let output = "";
        let errorOutput = "";

        yt.stdout.on("data", (data) => {
            output += data.toString();
        });

        yt.stderr.on("data", (data) => {
            errorOutput += data.toString();
        });

        yt.on("close", (code) => {
            if (code !== 0) {
                Logger.error(errorOutput);
                reject(new Error("Não foi possível carregar as informações do vídeo."));
                return;
            }

            try {
                const data = JSON.parse(output);

                resolve({
                    title: data.title || "",
                    channel: data.channel || data.uploader || "",
                    duration: formatDuration(data.duration),
                    thumbnail: data.thumbnail || "",
                    url: data.webpage_url || url
                });
            } catch {
                reject(new Error("Não foi possível interpretar as informações do vídeo."));
            }
        });

        yt.on("error", () => {
            reject(new Error("Erro ao iniciar leitura das informações do vídeo."));
        });
    });
}

function formatDuration(seconds) {
    if (!seconds) return "";

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) {
        return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }

    return `${m}:${String(s).padStart(2, "0")}`;
}

module.exports = {
    getVideoMetadata
};