window.Download = (() => {

    function initialize() {
        DOM.downloadBtn.addEventListener("click", startDownload);
        DOM.cancelBtn.addEventListener("click", cancelDownload);
    }

    function startDownload() {
        const url = DOM.input.value.trim();

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

            if (data.type === Events.DOWNLOAD_STARTED) {
                hideMetadataLoading();
                DOM.statusText.innerText = "Iniciando download...";
            }

            if (data.type === Events.DOWNLOAD_PROGRESS) {
                updateProgress(data);
            }

            if (data.type === Events.DOWNLOAD_COMPLETED) {
                hideMetadataLoading();
                showDownloadCompleted();
            }

            if (data.type === Events.DOWNLOAD_CANCELLED) {
                handleDownloadCancelled();
            }

            if (data.type === Events.DOWNLOAD_ERROR) {
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
    };
  
    function cancelDownload() {
            if (!AppState.downloadSocket || AppState.downloadSocket.readyState !== WebSocket.OPEN) {
            showError("Nenhum download em andamento para cancelar.");
            return;
        }

        AppState.downloadSocket.send(JSON.stringify({
            action: Actions.DOWNLOAD_CANCEL
        }));
    }

    return {
        initialize
    };

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


})();