import { OverlaysDaemon } from 'src/core/daemons/overlays'
import Color from './Color'

const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')!

export class OverlayImage {
  private raw: Uint8ClampedArray | null = null
  public readonly blob: Blob
  public bitmap: ImageBitmap | null = null

  constructor(blob: Blob) {
    this.blob = blob
    createImageBitmap(this.blob).then((v) => {
      this.bitmap = v
      canvas.width = v.width
      canvas.height = v.height
      context.drawImage(v, 0, 0)
      this.raw = context.getImageData(0, 0, v.width, v.height).data
      context.clearRect(0, 0, v.width, v.height)
    })
  }

  public getPixel(x: number, y: number) {
    if (!this.bitmap || !this.raw) return
    const state = OverlaysDaemon.getState()
    if (state.position) {
      x -= state.position.x
      y -= state.position.y
    }
    const index = (x + y * this.bitmap.width) * 4

    return new Color([
      this.raw[index],
      this.raw[index + 1],
      this.raw[index + 2]
    ])
  }

  public checkPointInside(x: number, y: number) {
    const state = OverlaysDaemon.getState()
    if (state.position) {
      x -= state.position.x
      y -= state.position.y
    }

    return (
      x >= 0 &&
      y >= 0 &&
      x <= this.bitmap!.width - 1 &&
      y <= this.bitmap!.height - 1
    )
  }
}
