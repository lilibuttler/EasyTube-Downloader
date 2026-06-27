const input = document.getElementById("videoUrl");
const button = document.getElementById("downloadBtn");
const progressArea = document.getElementById("progressArea");
const statusText = document.getElementById("status");
const percentText = document.getElementById("percent");
const progressFill = document.getElementById("progressFill");
const result = document.getElementById("result");

button.addEventListener("click", () => {
  const url = input.value.trim();

  if (!url) {
    result.classList.remove("hidden");
    result.textContent = "Cole um link do YouTube.";
    return;
  }

  button.disabled = true;
  result.classList.add("hidden");
  progressArea.classList.remove("hidden");

  statusText.textContent = "Preparando download...";
  percentText.textContent = "0%";
  progressFill.style.width = "0%";

  const socket = new WebSocket("ws://localhost:3000");

  socket.onopen = () => {
    socket.send(JSON.stringify({ url }));
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "status") {
      statusText.textContent = data.message;
    }

    if (data.type === "progress") {
      const percent = Math.min(100, Math.round(data.percent));
      statusText.textContent = "Baixando vídeo...";
      percentText.textContent = `${percent}%`;
      progressFill.style.width = `${percent}%`;
    }

    if (data.type === "done") {
      progressFill.style.width = "100%";
      percentText.textContent = "100%";
      statusText.textContent = "Download concluído.";

      result.classList.remove("hidden");
      result.innerHTML = `
        Download finalizado com sucesso.<br>
        Arquivo salvo em: <strong>${data.folder}</strong>
      `;

      button.disabled = false;
      socket.close();
    }

    if (data.type === "error") {
      result.classList.remove("hidden");
      result.textContent = data.message;

      button.disabled = false;
      socket.close();
    }
  };

  socket.onerror = () => {
    result.classList.remove("hidden");
    result.textContent = "Erro ao conectar com o aplicativo local.";

    button.disabled = false;
  };
});