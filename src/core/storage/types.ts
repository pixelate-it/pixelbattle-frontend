import { config } from 'src/config'

export interface CookieMap {
  userid: string
  token: string
}

export type PaletteRaw = typeof config.defaults.colors.palette

export interface OverlayInStorage {
  data: string
  name: string
  position: {
    x: number
    y: number
  }
  opacity: number
}

export interface OverlayImageInput {
  data: string | Blob
  name: string
  position: {
    x: number
    y: number
  }
  opacity: number
}

export type Overlays = Array<{
  data: string
  name: string
  position: {
    x: number
    y: number
  }
  opacity: number
}>

export interface LocalStorageMap {
  palette: PaletteRaw
  overlays?: Overlays
  currentOverlay?: number
  overlayViewMode?: number
}
