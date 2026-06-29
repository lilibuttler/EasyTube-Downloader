const {
    getConfig,
    saveConfig,
    getDownloadFolder
} = require("../config/ConfigService");

async function handle(data, socket) {
    if (data.mode === "save") {
        const updatedConfig = saveConfig(data.settings || {});

        socket.settingsLoaded({
            ...updatedConfig,
            resolvedDownloadFolder: getDownloadFolder()
        });

        return;
    }

    const config = getConfig();

    socket.settingsLoaded({
        ...config,
        resolvedDownloadFolder: getDownloadFolder()
    });
}

module.exports = {
    handle
};