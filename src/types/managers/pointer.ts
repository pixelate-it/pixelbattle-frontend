import { PixelInfo } from '../api'

export interface PointerState {
  coordinates: [number, number]
  empty: boolean
  info: PixelInfo | null | 'loading'
}
