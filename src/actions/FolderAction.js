const { getDownloadFolder } = require("../config/ConfigService");
const { openFolder } = require("../system/Explorer");

async function handle(data, socket) {
    const folder = getDownloadFolder();

    openFolder(folder);

    socket.folderOpened(folder);
}

module.exports = {
    handle
};