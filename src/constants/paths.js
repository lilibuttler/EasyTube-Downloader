const path = require("path");
const os = require("os");

const ROOT = path.join(__dirname, "..", "..");
const USER_HOME = os.homedir();

const Paths = {

    // Projeto
    ROOT,
    BIN: path.join(ROOT, "bin"),
    PUBLIC: path.join(ROOT, "public"),
    CONFIG: path.join(ROOT, "config"),

    // Pastas do usuário
    USER_HOME,
    DESKTOP: path.join(USER_HOME, "Desktop"),
    DOWNLOADS: path.join(USER_HOME, "Downloads"),
    VIDEOS: path.join(USER_HOME, "Videos"),

    // Pasta padrão da aplicação
    DEFAULT_DOWNLOAD_FOLDER: path.join(USER_HOME, "Videos"),

    // Executáveis
    YT_DLP: path.join(ROOT, "bin", "yt-dlp.exe"),
    FFMPEG_DIR: path.join(ROOT, "bin"),
    FFMPEG: path.join(ROOT, "bin", "ffmpeg.exe"),
    FFPROBE: path.join(ROOT, "bin", "ffprobe.exe")
};

module.exports = Paths;