const { exec } = require("child_process");

class DownloadManager {
    constructor() {
        this.activeDownloads = new Map();
    }

    register(id, process) {
        this.activeDownloads.set(id, {
            process,
            cancelled: false
        });
    }

    unregister(id) {
        this.activeDownloads.delete(id);
    }

    cancelCurrent() {
        const first = this.activeDownloads.entries().next();

        if (first.done) {
            return false;
        }

        const [id, download] = first.value;
        const process = download.process;

        download.cancelled = true;

        if (process.pid) {
            exec(`taskkill /PID ${process.pid} /T /F`);
        } else {
            process.kill();
        }

        return true;
    }

    isCancelled(id) {
        const download = this.activeDownloads.get(id);
        return download ? download.cancelled === true : false;
    }

    has(id) {
        return this.activeDownloads.has(id);
    }

    count() {
        return this.activeDownloads.size;
    }
}

module.exports = new DownloadManager();