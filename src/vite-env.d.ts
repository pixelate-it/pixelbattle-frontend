/// <reference types="vite/client" />
/// <reference types="vite-plugin-glsl/ext" />

interface ImportMetaEnv {
  readonly VITE_DEV_MODE: boolean
  readonly VITE_BACKEND: string
  readonly VITE_DISCORD_BOT_ID: string
  readonly VITE_DISCORD_BOT_REDIRECT: string
}
