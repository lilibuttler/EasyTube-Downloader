 
const { spawn, exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const { getDownloadPath } = require("./configManager");
const { getPaths } = require("./componentChecker");

function startDownload(url, ws) {

    const downloadPath = getDownloadPath();

    if (!fs.existsSync(downloadPath)) {
        fs.mkdirSync(downloadPath, { recursive: true });
    }

    const paths = getPaths();

    const args = [

        "--ffmpeg-location",
        path.dirname(paths.ffmpeg),

        "--newline",

        "--windows-filenames",

        "--no-part",

        "--merge-output-format",
        "mp4",

        "-f",
        "bestvideo+bestaudio/best",

        "-o",
        path.join(downloadPath, "%(title)s.%(ext)s"),

        url

    ];

    const yt = spawn(paths.ytDlp, args);

    yt.stdout.on("data", data => {

        parseOutput(data.toString(), ws);

    });

    yt.stderr.on("data", data => {

        parseOutput(data.toString(), ws);

    });

    yt.on("close", code => {

        if (code === 0) {

            exec(`explorer "${downloadPath}"`);

            ws.send(JSON.stringify({

                type: "done",
                folder: downloadPath

            }));

        } else {

            ws.send(JSON.stringify({

                type: "error",
                message: "O download não pôde ser concluído."

            }));

        }

    });

}

function parseOutput(text, ws) {

    const regex = /(\d+(?:\.\d+)?)%\s+of\s+([^\s]+)\s+at\s+([^\s]+)\s+ETA\s+([0-9:]+)/;

    const match = text.match(regex);

    if (!match) return;

    ws.send(JSON.stringify({

        type: "progress",

        percent: parseFloat(match[1]),

        downloaded: match[2],

        speed: match[3],

        eta: match[4]

    }));

}

module.exports = {

    startDownload

};