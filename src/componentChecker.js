const fs = require("fs");
const path = require("path");

const BIN_PATH = path.join(__dirname, "..", "bin");

const components = {
    ytDlp: path.join(BIN_PATH, "yt-dlp.exe"),
    ffmpeg: path.join(BIN_PATH, "ffmpeg.exe"),
    ffprobe: path.join(BIN_PATH, "ffprobe.exe")
};

function checkComponents() {

    const result = {
        ok: true,
        missing: []
    };

    Object.entries(components).forEach(([name, file]) => {

        if (!fs.existsSync(file)) {

            result.ok = false;

            result.missing.push({
                component: name,
                path: file
            });

        }

    });

    return result;

}

function getPaths() {

    return components;

}

module.exports = {

    checkComponents,
    getPaths

}; 
