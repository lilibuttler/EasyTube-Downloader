const { getVideoMetadata } = require("../download/MetadataService");

async function handle(data, socket) {
    const video = await getVideoMetadata(data.url);
    socket.metadata(video);
}

module.exports = {
    handle
};