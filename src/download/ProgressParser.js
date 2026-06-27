function parseProgress(text) {
    const percentMatch = text.match(/\[download\]\s+(\d+(?:\.\d+)?)%/);

    if (!percentMatch) {
        return null;
    }

    const speedMatch = text.match(/at\s+([^\s]+)/);
    const etaMatch = text.match(/ETA\s+([^\s]+)/);
    const sizeMatch = text.match(/of\s+([^\s]+)/);

    return {
        percent: parseFloat(percentMatch[1]),
        speed: speedMatch ? speedMatch[1] : "",
        eta: etaMatch ? etaMatch[1] : "",
        size: sizeMatch ? sizeMatch[1] : ""
    };
}

module.exports = {
    parseProgress
};