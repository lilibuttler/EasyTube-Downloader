const input = document.getElementById("videoUrl");
const button = document.getElementById("downloadBtn");
const pasteBtn = document.getElementById("pasteBtn");
const clearBtn = document.getElementById("clearBtn");
const cancelBtn = document.getElementById("cancelBtn");

const loadingMetadata = document.getElementById("loadingMetadata");

const progressArea = document.getElementById("progressArea");
const progressFill = document.getElementById("progressFill");
const percentText = document.getElementById("percent");
const statusText = document.getElementById("status");
const progressDetails = document.getElementById("progressDetails");

const result = document.getElementById("result");

const videoPreview = document.getElementById("videoPreview");
const videoThumbnail = document.getElementById("videoThumbnail");
const videoTitle = document.getElementById("videoTitle");
const videoChannel = document.getElementById("videoChannel");
const videoDuration = document.getElementById("videoDuration");

const settingsBtn = document.getElementById("settingsBtn");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");
const settingsPanel = document.getElementById("settingsPanel");
const settingsOverlay = document.getElementById("settingsOverlay");

let currentUrl = "";
let hasMetadata = false;
let downloadSocket = null;

resetInitialState();

pasteBtn.addEventListener("click", async () => {
    try {
        const text = await navigator.clipboard.readText();
        input.value = text.trim();
        input.focus();
        loadMetadata();
    } catch {
        showError("Não foi possível acessar a área de transferência.");
    }
});

clearBtn.addEventListener("click", () => {
    input.value = "";
    currentUrl = "";
    hasMetadata = false;
    resetInitialState();
    input.focus();
});

cancelBtn.addEventListener("click", cancelDownload);

input.addEventListener("input", () => {
    const url = input.value.trim();

    if (!url) {
        currentUrl = "";
        hasMetadata = false;
        resetInitialState();
    }
});

input.addEventListener("paste", () => {
    setTimeout(loadMetadata, 250);
});

input.addEventListener("change", loadMetadata);

if (settingsBtn) {
    settingsBtn.addEventListener("click", openSettingsPanel);
}

if (closeSettingsBtn) {
    closeSettingsBtn.addEventListener("click", closeSettingsPanel);
}

if (settingsOverlay) {
    settingsOverlay.addEventListener("click", closeSettingsPanel);
}

button.addEventListener("click", () => {
    const url = input.value.trim();

    if (!url) {
        showError("Informe um link do YouTube.");
        return;
    }

    if (!hasMetadata) {
        showError("Aguarde carregar as informações do vídeo antes de baixar.");
        return;
    }

    resetDownloadScreen();

    downloadSocket = new WebSocket(`ws://${window.location.host}`);

    downloadSocket.onopen = () => {
        downloadSocket.send(JSON.stringify({
            action: "download",
            url
        }));
    };

    downloadSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "download.started") {
            hideMetadataLoading();
            statusText.innerText = "Iniciando download...";
        }

        if (data.type === "download.progress") {
            updateProgress(data);
        }

        if (data.type === "download.completed") {
            hideMetadataLoading();
            showDownloadCompleted();
        }

        if (data.type === "download.cancelled") {
            handleDownloadCancelled();
        }

        if (data.type === "download.error") {
            hideMetadataLoading();
            showError(data.message || "Não foi possível baixar este vídeo.");
            finishDownload();
        }
    };

    downloadSocket.onerror = () => {
        hideMetadataLoading();
        showError("Erro ao conectar com o aplicativo.");
        finishDownload();
    };
});

function loadMetadata() {
    const url = input.value.trim();

    if (!url || url === currentUrl) return;

    currentUrl = url;
    hasMetadata = false;

    showMetadataLoading();

    const socket = new WebSocket(`ws://${window.location.host}`);

    socket.onopen = () => {
        socket.send(JSON.stringify({
            action: "metadata",
            url
        }));
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "metadata.loaded") {
            hideMetadataLoading();
            showVideoPreview(data.video);

            hasMetadata = true;
            button.disabled = false;
            button.innerText = "Baixar vídeo";

            socket.close();
        }

        if (data.type === "download.error") {
            hideMetadataLoading();

            hasMetadata = false;
            button.disabled = true;
            button.innerText = "Baixar vídeo";

            showError(data.message || "Não foi possível carregar as informações do vídeo.");

            socket.close();
        }
    };

    socket.onerror = () => {
        hideMetadataLoading();

        hasMetadata = false;
        button.disabled = true;
        button.innerText = "Baixar vídeo";

        showError("Erro ao carregar informações do vídeo.");
    };
}

function showMetadataLoading() {
    loadingMetadata.classList.remove("hidden");
    videoPreview.classList.add("hidden");
    progressArea.classList.add("hidden");
    cancelBtn.classList.add("hidden");

    result.classList.add("hidden");
    result.innerHTML = "";

    clearPreview();

    button.disabled = true;
    button.innerText = "Obtendo informações...";
}

function hideMetadataLoading() {
    loadingMetadata.classList.add("hidden");
}

function showVideoPreview(video) {
    videoThumbnail.src = video.thumbnail || "";
    videoTitle.innerText = video.title || "Título não disponível";
    videoChannel.innerText = video.channel ? `Canal: ${video.channel}` : "";
    videoDuration.innerText = video.duration ? `Duração: ${video.duration}` : "";

    videoPreview.classList.remove("hidden");
    result.classList.add("hidden");
}

function clearPreview() {
    videoThumbnail.removeAttribute("src");
    videoTitle.innerText = "";
    videoChannel.innerText = "";
    videoDuration.innerText = "";
}

function resetInitialState() {
    hideMetadataLoading();

    clearPreview();

    videoPreview.classList.add("hidden");
    progressArea.classList.add("hidden");
    cancelBtn.classList.add("hidden");

    result.classList.add("hidden");
    result.innerHTML = "";

    progressFill.style.width = "0%";
    percentText.innerText = "0%";
    statusText.innerText = "Preparando download...";
    progressDetails.innerHTML = "";

    button.disabled = true;
    button.innerText = "Baixar vídeo";
}

function resetDownloadScreen() {
    hideMetadataLoading();

    result.classList.add("hidden");
    result.innerHTML = "";

    progressArea.classList.remove("hidden");
    cancelBtn.classList.remove("hidden");

    progressFill.style.width = "0%";
    percentText.innerText = "0%";
    statusText.innerText = "Preparando download...";
    progressDetails.innerHTML = "";

    button.disabled = true;
    button.innerText = "Baixando...";
}

function updateProgress(data) {
    const percent = Math.round(data.percent || 0);

    progressFill.style.width = `${percent}%`;
    percentText.innerText = `${percent}%`;
    statusText.innerText = "Baixando vídeo...";

    progressDetails.innerHTML = `
        <span>Tamanho: <strong>${data.size || "-"}</strong></span>
        <span>Velocidade: <strong>${data.speed || "-"}</strong></span>
        <span>Tempo restante: <strong>${data.eta || "-"}</strong></span>
    `;
}

function showDownloadCompleted() {
    progressFill.style.width = "100%";
    percentText.innerText = "100%";
    statusText.innerText = "Download concluído.";
    cancelBtn.classList.add("hidden");

    progressDetails.innerHTML = `
        <span>Status: <strong>Finalizado</strong></span>
    `;

    result.classList.remove("hidden");
    result.innerHTML = `
        <div class="success-card">
            <h2>Download concluído!</h2>
            <p>Seu vídeo foi salvo com sucesso.</p>

            <button id="openFolderBtn" class="folder-button" type="button">
                📂 Abrir pasta
            </button>
        </div>
    `;

    document
        .getElementById("openFolderBtn")
        .addEventListener("click", openDownloadFolder);

    finishDownload();
}

function handleDownloadCancelled() {
    cancelBtn.classList.add("hidden");

    progressFill.style.width = "0%";
    percentText.innerText = "0%";
    statusText.innerText = "Download cancelado.";
    progressDetails.innerHTML = "";

    result.classList.remove("hidden");
    result.innerHTML = `
        <div class="success-card">
            <h2>Download cancelado</h2>
            <p>O download foi interrompido pelo usuário.</p>
        </div>
    `;

    finishDownload();
}

function showError(message) {
    cancelBtn.classList.add("hidden");

    result.classList.remove("hidden");
    result.innerHTML = `<strong>${message}</strong>`;

    button.disabled = !hasMetadata;
    button.innerText = "Baixar vídeo";
}

function finishDownload() {
    button.disabled = false;
    button.innerText = "Baixar vídeo";
    cancelBtn.classList.add("hidden");

    if (downloadSocket && downloadSocket.readyState === WebSocket.OPEN) {
        downloadSocket.close();
    }

    downloadSocket = null;
}

function openDownloadFolder() {
    const socket = new WebSocket(`ws://${window.location.host}`);

    socket.onopen = () => {
        socket.send(JSON.stringify({
            action: "open-folder"
        }));
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "folder.opened") {
            socket.close();
        }

        if (data.type === "download.error") {
            showError(data.message || "Não foi possível abrir a pasta.");
            socket.close();
        }
    };

    socket.onerror = () => {
        showError("Erro ao abrir a pasta.");
    };
}

function cancelDownload() {
    if (!downloadSocket || downloadSocket.readyState !== WebSocket.OPEN) {
        showError("Nenhum download em andamento para cancelar.");
        return;
    }

    downloadSocket.send(JSON.stringify({
        action: "cancel-download"
    }));
}

function openSettingsPanel() {
    settingsPanel.classList.add("open");
    settingsOverlay.classList.remove("hidden");
}

function closeSettingsPanel() {
    settingsPanel.classList.remove("open");
    settingsOverlay.classList.add("hidden");
}