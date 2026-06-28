const Errors = {
    INVALID_URL: {
        code: "INVALID_URL",
        userMessage: "Cole um link válido do YouTube."
    },

    YT_DLP_NOT_FOUND: {
        code: "YT_DLP_NOT_FOUND",
        userMessage: "O componente de download não foi encontrado."
    },

    FFMPEG_NOT_FOUND: {
        code: "FFMPEG_NOT_FOUND",
        userMessage: "O componente de finalização do vídeo não foi encontrado."
    },

    VIDEO_UNAVAILABLE: {
        code: "VIDEO_UNAVAILABLE",
        userMessage: "Este vídeo não está disponível para download."
    },

    NETWORK_ERROR: {
        code: "NETWORK_ERROR",
        userMessage: "Não foi possível conectar ao YouTube. Verifique sua internet."
    },

    DOWNLOAD_FAILED: {
        code: "DOWNLOAD_FAILED",
        userMessage: "Não foi possível baixar este vídeo."
    },

    MERGE_FAILED: {
        code: "MERGE_FAILED",
        userMessage: "O vídeo foi baixado, mas não foi possível finalizar o MP4."
    },

    UNEXPECTED_ERROR: {
        code: "UNEXPECTED_ERROR",
        userMessage: "Ocorreu um erro inesperado."
    }
};

module.exports = Errors;