/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BASE_API_URL: string;
    readonly VITE_DEVELOPMENT_MODE: boolean;
    // add more variables here as needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
