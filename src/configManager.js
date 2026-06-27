const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "..", "config", "config.json");

function getConfig() {
  if (!fs.existsSync(configPath)) {
    return {
      downloadFolder: "Desktop/YouTube Downloader",
      defaultFormat: "mp4",
      defaultQuality: "best"
    };
  }

  const raw = fs.readFileSync(configPath, "utf-8");
  return JSON.parse(raw);
}

function getDownloadPath() {
  const config = getConfig();

  return path.join(
    process.env.USERPROFILE,
    ...config.downloadFolder.split("/")
  );
}

module.exports = {
  getConfig,
  getDownloadPath
};