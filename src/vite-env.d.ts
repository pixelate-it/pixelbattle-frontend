/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MODE: 'PROD' | string
  readonly VITE_BACKEND: string
  readonly VITE_DISCORD_BOT_ID: string
  readonly VITE_DISCORD_BOT_REDIRECT: string
}
