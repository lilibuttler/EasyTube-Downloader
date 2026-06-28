function parseProgress(text) {
    const percentMatch = text.match(/\[download\]\s+(\d+(?:\.\d+)?)%/);

    if (!percentMatch) return null;

    const sizeMatch = text.match(/of\s+~?\s*([0-9.]+\s*[A-Za-z]+)/);
    const speedMatch = text.match(/at\s+([0-9.]+\s*[A-Za-z/]+|Unknown\s+B\/s)/);
    const etaMatch = text.match(/ETA\s+([0-9:]+|Unknown)/);

    return {
        percent: parseFloat(percentMatch[1]),
        size: sizeMatch ? sizeMatch[1] : "-",
        speed: speedMatch ? speedMatch[1] : "-",
        eta: etaMatch ? etaMatch[1] : "-"
    };
}

module.exports = { parseProgress };