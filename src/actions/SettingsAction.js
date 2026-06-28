const { getConfig, getDownloadFolder } = require("../config/ConfigService");

async function handle(data, socket) {
    const config = getConfig();

    socket.settingsLoaded({
        ...config,
        resolvedDownloadFolder: getDownloadFolder()
    });
}

module.exports = {
    handle
};