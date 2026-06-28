const { exec } = require("child_process");

function openFolder(folderPath) {
    exec(`explorer "${folderPath}"`);
}

module.exports = {
    openFolder
};