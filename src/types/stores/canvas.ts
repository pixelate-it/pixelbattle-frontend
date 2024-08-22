import { PixelInfo } from '../api'

export interface CanvasState {
  canvasLoadingException: boolean
  pointerCoordinates: number[]
  canvasPrepared: boolean
  pixelInfo: PixelInfo | null
}
