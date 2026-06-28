const fs = require("fs");
const path = require("path");

const Paths = require("../constants/Paths");

const DEFAULT_CONFIG = {
    downloadFolder: Paths.DOWNLOADS,
    format: "mp4",
    quality: "best"
};

const CONFIG_FILE = path.join(Paths.CONFIG, "config.json");

function ensureConfigFile() {
    if (!fs.existsSync(Paths.CONFIG)) {
        fs.mkdirSync(Paths.CONFIG, { recursive: true });
    }

    if (!fs.existsSync(CONFIG_FILE)) {
        fs.writeFileSync(
            CONFIG_FILE,
            JSON.stringify(DEFAULT_CONFIG, null, 4),
            "utf-8"
        );
    }
}

function getConfig() {
    ensureConfigFile();

    const content = fs.readFileSync(CONFIG_FILE, "utf-8");
    return JSON.parse(content);
}

function getDownloadFolder() {
    const config = getConfig();

    return config.downloadFolder || DEFAULT_CONFIG.downloadFolder;
}

module.exports = {
    getConfig,
    getDownloadFolder
};