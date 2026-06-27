class Download {
    constructor({ url, format = "mp4", quality = "best" }) {
        this.id = Date.now().toString();
        this.url = url;
        this.format = format;
        this.quality = quality;
        this.status = "created";
        this.percent = 0;
        this.createdAt = new Date();
        this.startedAt = null;
        this.finishedAt = null;
    }

    start() {
        this.status = "downloading";
        this.startedAt = new Date();
    }

    complete() {
        this.status = "completed";
        this.percent = 100;
        this.finishedAt = new Date();
    }

    fail() {
        this.status = "error";
        this.finishedAt = new Date();
    }
}

module.exports = Download;