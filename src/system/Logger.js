class Logger {
    info(message) {
        console.log(`[INFO] ${message}`);
    }

    warn(message) {
        console.warn(`[WARN] ${message}`);
    }

    error(message) {
        console.error(`[ERROR] ${message}`);
    }

    debug(message) {
        if (process.env.DEBUG === "true") {
            console.log(`[DEBUG] ${message}`);
        }
    }
}

module.exports = new Logger();