/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_DB_HOST?: string
  readonly VITE_DB_PORT?: string
  readonly VITE_DB_SERVICE?: string
  readonly VITE_DB_USER?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
