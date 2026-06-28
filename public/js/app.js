const input = document.getElementById("videoUrl");
const button = document.getElementById("downloadBtn");
const pasteBtn = document.getElementById("pasteBtn");
const clearBtn = document.getElementById("clearBtn");

const progressArea = document.getElementById("progressArea");
const progressFill = document.getElementById("progressFill");
const percentText = document.getElementById("percent");
const statusText = document.getElementById("status");

const result = document.getElementById("result");

let progressDetails = document.getElementById("progressDetails");

if (!progressDetails) {
    progressDetails = document.createElement("div");
    progressDetails.id = "progressDetails";
    progressArea.appendChild(progressDetails);
}

pasteBtn.addEventListener("click", async () => {
    try {
        const text = await navigator.clipboard.readText();
        input.value = text.trim();
        input.focus();
    } catch {
        showError("Não foi possível acessar a área de transferência.");
    }
});

clearBtn.addEventListener("click", () => {
    input.value = "";
    input.focus();
    result.classList.add("hidden");
    result.innerHTML = "";
});

button.addEventListener("click", () => {
    const url = input.value.trim();

    if (!url) {
        showError("Informe um link do YouTube.");
        return;
    }

    resetScreen();

    const socket = new WebSocket(`ws://${window.location.host}`);

    socket.onopen = () => {
        socket.send(JSON.stringify({ url }));
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "download.started") {
            statusText.innerText = "Iniciando download...";
        }

        if (data.type === "download.progress") {
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

        if (data.type === "download.completed") {
            progressFill.style.width = "100%";
            percentText.innerText = "100%";
            statusText.innerText = "Download concluído.";

            progressDetails.innerHTML = `
                <span>Status: <strong>Finalizado</strong></span>
            `;

            result.classList.remove("hidden");
            result.innerHTML = `
                <h2>Download concluído!</h2>
                <p>O vídeo foi salvo na pasta <strong>YouTube Downloader</strong> na Área de Trabalho.</p>
            `;

            finishDownload(socket);
        }

        if (data.type === "download.error") {
            showError(data.message || "Não foi possível baixar este vídeo.");
            finishDownload(socket);
        }
    };

    socket.onerror = () => {
        showError("Erro ao conectar com o aplicativo.");
        button.disabled = false;
        button.innerText = "Baixar vídeo";
    };
});

function resetScreen() {
    result.classList.add("hidden");
    result.innerHTML = "";

    progressArea.classList.remove("hidden");

    progressFill.style.width = "0%";
    percentText.innerText = "0%";
    statusText.innerText = "Preparando download...";
    progressDetails.innerHTML = "";

    button.disabled = true;
    button.innerText = "Baixando...";
}

function showError(message) {
    result.classList.remove("hidden");
    result.innerHTML = `<strong>${message}</strong>`;

    button.disabled = false;
    button.innerText = "Baixar vídeo";
}

function finishDownload(socket) {
    button.disabled = false;
    button.innerText = "Baixar vídeo";

    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
    }
}