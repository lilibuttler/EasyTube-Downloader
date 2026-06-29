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

const downloadFolderInput = document.getElementById("downloadFolder");
const videoQualityInput = document.getElementById("videoQuality");
const videoFormatInput = document.getElementById("videoFormat");
const openFolderAfterDownloadInput = document.getElementById("openFolderAfterDownload");

AppState.currentUrl = "";
AppState.hasMetadata = false;
AppState.downloadSocket = null;

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
    AppState.currentUrl = "";
    AppState.hasMetadata = false;
    resetInitialState();
    input.focus();
});

cancelBtn.addEventListener("click", cancelDownload);

input.addEventListener("input", () => {
    const url = input.value.trim();

    if (!url) {
        AppState.currentUrl = "";
        AppState.hasMetadata = false;
        resetInitialState();
    }
});

input.addEventListener("paste", () => {
    setTimeout(loadMetadata, 250);
});

input.addEventListener("change", loadMetadata);

button.addEventListener("click", () => {
    const url = input.value.trim();

    if (!url) {
        showError("Informe um link do YouTube.");
        return;
    }

    if (!AppState.hasMetadata) {
        showError("Aguarde carregar as informações do vídeo antes de baixar.");
        return;
    }

    resetDownloadScreen();

    AppState.downloadSocket = new WebSocket(`ws://${window.location.host}`);

    AppState.downloadSocket.onopen = () => {
        AppState.downloadSocket.send(JSON.stringify({
            action: Actions.DOWNLOAD_START,
            url
        }));
    };

    AppState.downloadSocket.onmessage = (event) => {
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

    AppState.downloadSocket.onerror = () => {
        hideMetadataLoading();
        showError("Erro ao conectar com o aplicativo.");
        finishDownload();
    };
});

function loadMetadata() {
    const url = input.value.trim();

    if (!url || url === AppState.currentUrl) return;

    AppState.currentUrl = url;
    AppState.hasMetadata = false;

    showMetadataLoading();

    const socket = new WebSocket(`ws://${window.location.host}`);

    socket.onopen = () => {
        socket.send(JSON.stringify({
           action: Actions.METADATA_LOAD,
            url
        }));
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "metadata.loaded") {
            hideMetadataLoading();
            showVideoPreview(data.video);

            AppState.hasMetadata = true;
            DOM.downloadBtn.disabled = false;
            DOM.downloadBtn.innerText = "Baixar vídeo";

            socket.close();
        }

        if (data.type === Events.DOWNLOAD_ERROR) {
            hideMetadataLoading();

            AppState.hasMetadata = true;
            DOM.downloadBtn.disabled = false;
            DOM.downloadBtn.innerText = "Baixar vídeo";

            DOM.videoPreview.classList.add("hidden");

            showError(
                "Não foi possível carregar as informações do vídeo. Você ainda pode tentar baixar mesmo assim."
            );

            socket.close();
        }
    };

    socket.onerror = () => {
        hideMetadataLoading();

        AppState.hasMetadata = true;
        DOM.downloadBtn.disabled = false;
        DOM.downloadBtn.innerText = "Baixar vídeo";

        showError(
            "Erro ao carregar informações do vídeo. Você ainda pode tentar baixar mesmo assim."
        );
    };
}

function showMetadataLoading() {
    DOM.loadingMetadata.classList.remove("hidden");
    DOM.videoPreview.classList.add("hidden");
    DOM.progressArea.classList.add("hidden");
    DOM.cancelBtn.classList.add("hidden");

    result.classList.add("hidden");
    result.innerHTML = "";

    clearPreview();

    DOM.downloadBtn.disabled = true;
    DOM.downloadBtn.innerText = "Obtendo informações...";
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

    DOM.downloadBtn.disabled = true;
    DOM.downloadBtn.innerText = "Baixar vídeo";
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

    DOM.downloadBtn.disabled = true;
    DOM.downloadBtn.innerText = "Baixando...";
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

    DOM.cancelBtn.classList.add("hidden");

    DOM.result.classList.remove("hidden");
    DOM.result.innerHTML = `<strong>${message}</strong>`;

    DOM.downloadBtn.disabled = !AppState.hasMetadata;
    DOM.downloadBtn.innerText = "Baixar vídeo";

}

function finishDownload() {
    DOM.downloadBtn.disabled = false;
    DOM.downloadBtn.innerText = "Baixar vídeo";
    DOM.cancelBtn.classList.add("hidden");

    if (AppState.downloadSocket && AppState.downloadSocket.readyState === WebSocket.OPEN) {
        AppState.downloadSocket.close();
    }

    AppState.downloadSocket = null;
}

function openDownloadFolder() {
    const socket = new WebSocket(`ws://${window.location.host}`);

    socket.onopen = () => {
        socket.send(JSON.stringify({
            action: Actions.FOLDER_OPEN
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
    if (!AppState.downloadSocket || AppState.downloadSocket.readyState !== WebSocket.OPEN) {
        showError("Nenhum download em andamento para cancelar.");
        return;
    }

    AppState.downloadSocket.send(JSON.stringify({
        action: Actions.DOWNLOAD_CANCEL
    }));
}

Settings.initialize();