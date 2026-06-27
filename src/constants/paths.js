const path = require("path");

const ROOT = path.join(__dirname, "..", "..");

const Paths = {
    ROOT,
    BIN: path.join(ROOT, "bin"),
    PUBLIC: path.join(ROOT, "public"),
    CONFIG: path.join(ROOT, "config"),
    DOWNLOADS: path.join(process.env.USERPROFILE, "Desktop", "YouTube Downloader"),

    YT_DLP: path.join(ROOT, "bin", "yt-dlp.exe"),
    FFMPEG_DIR: path.join(ROOT, "bin"),
    FFMPEG: path.join(ROOT, "bin", "ffmpeg.exe"),
    FFPROBE: path.join(ROOT, "bin", "ffprobe.exe")
};

module.exports = Paths;