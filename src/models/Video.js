class Video {
    constructor({
        title = "",
        channel = "",
        thumbnail = "",
        duration = "",
        size = "",
        resolution = ""
    } = {}) {
        this.title = title;
        this.channel = channel;
        this.thumbnail = thumbnail;
        this.duration = duration;
        this.size = size;
        this.resolution = resolution;
    }
}

module.exports = Video;