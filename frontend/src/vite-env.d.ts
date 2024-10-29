/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GOOGLE_API_KEY: string;
    readonly VITE_GOOGLE_CLIENT_ID: string;
    readonly VITE_GOOGLE_SCOPES: string;
    // Agrega aquí otras variables de entorno que necesites
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  