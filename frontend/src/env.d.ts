/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backend origin, e.g. https://wind-api.vercel.app. Empty string = same origin. */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
