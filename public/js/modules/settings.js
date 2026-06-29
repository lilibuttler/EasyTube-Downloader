window.Settings = {
    initialize() {
        if (DOM.settingsBtn) {
            DOM.settingsBtn.addEventListener("click", Settings.open);
        }

        if (DOM.closeSettingsBtn) {
            DOM.closeSettingsBtn.addEventListener("click", Settings.close);
        }

        if (DOM.settingsOverlay) {
            DOM.settingsOverlay.addEventListener("click", Settings.close);
        }
    },

    open() {
        DOM.settingsPanel.classList.add("open");
        DOM.settingsOverlay.classList.remove("hidden");

        Settings.load();
    },

    close() {
        DOM.settingsPanel.classList.remove("open");
        DOM.settingsOverlay.classList.add("hidden");
    },

    load() {
        const socket = new WebSocket(`ws://${window.location.host}`);

        socket.onopen = () => {
            socket.send(JSON.stringify({
                action: Actions.SETTINGS_LOAD
            }));
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === Events.SETTINGS_LOADED) {
                Settings.fill(data.settings);
                socket.close();
            }

            if (data.type === Events.DOWNLOAD_ERROR) {
                alert(data.message || "Não foi possível carregar as configurações.");
                socket.close();
            }
        };

        socket.onerror = () => {
            alert("Erro ao carregar configurações.");
        };
    },

    fill(settings) {
        if (!settings) return;

        DOM.downloadFolder.value = settings.resolvedDownloadFolder || "";

        DOM.videoQuality.value = settings.videoQuality || "best";

        DOM.videoFormat.value = settings.format || "mp4";

        DOM.openFolderAfterDownload.checked =
            settings.openFolderAfterDownload === true;

        DOM.cookiesBrowser.value = settings.cookiesBrowser || "edge";
    }
};