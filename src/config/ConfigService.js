const fs = require("fs");
const path = require("path");

const Paths = require("../constants/Paths");

const DEFAULT_CONFIG = {
    downloadFolder: "videos",
    format: "mp4",
    videoQuality: "best",
    openFolderAfterDownload: true,
    cookiesBrowser: "edge"
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
    return resolveDownloadFolder(config.downloadFolder);
}

function resolveDownloadFolder(downloadFolder) {
    if (!downloadFolder) {
        return Paths.DEFAULT_DOWNLOAD_FOLDER;
    }

    if (downloadFolder === "videos") {
        return Paths.VIDEOS;
    }

    if (downloadFolder === "desktop") {
        return Paths.DESKTOP;
    }

    if (downloadFolder === "downloads") {
        return Paths.DOWNLOADS;
    }

    return downloadFolder;
}

function saveConfig(config) {
    ensureConfigFile();

    const current = getConfig();

    const updated = {
        ...current,
        ...config
    };

    fs.writeFileSync(
        CONFIG_FILE,
        JSON.stringify(updated, null, 4),
        "utf-8"
    );

    return updated;
}

module.exports = {
    getConfig,
    saveConfig,
    getDownloadFolder,
    resolveDownloadFolder
};