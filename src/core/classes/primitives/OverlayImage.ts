import Color from './Color'
import { OverlayImageInput, OverlayInStorage } from '../storage/types'
import { blobToString, stringToBlob } from '../storage/util'

const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')!

export class OverlayImage {
  private raw: Uint8ClampedArray | null = null
  public blob: Blob | null = null
  public bitmap: ImageBitmap | null = null
  public x = 0
  public y = 0
  public opacity = 0
  public imageName = ''
  private data = ''

  constructor() {}

  async process(overlay: OverlayImageInput) {
    this.x = overlay.position.x
    this.y = overlay.position.y
    this.opacity = overlay.opacity
    this.imageName = overlay.name
    if (overlay.data instanceof Blob) this.blob = overlay.data
    else this.blob = await stringToBlob(overlay.data)
    if (overlay.data instanceof Blob)
      this.data = await blobToString(overlay.data)
    else this.data = await blobToString(this.blob)
    createImageBitmap(this.blob).then((v) => {
      this.bitmap = v

      const { width, height } = this.bitmap
      canvas.width = width
      canvas.height = height
      context.drawImage(this.bitmap, 0, 0)
      this.raw = context.getImageData(0, 0, width, height).data
      context.clearRect(0, 0, width, height)
    })

    return this
  }

  public getPixel(x: number, y: number): undefined | Color {
    if (!this.bitmap || !this.raw) return
    x -= this.x
    y -= this.y
    const index = x + y * this.bitmap.width
    const [r, g, b, ...rest] = this.raw.slice(index * 4, index * 4 + 4)

    if (rest.length !== 0 && rest[0] === 0) return

    if (rest.length !== 0 && rest[0] === 255)
      return new Color([r, g, b, rest.length === 0 ? 255 : rest[0]])

    const base = [255, 255, 255, 1]
    const added = [r, g, b, rest[0] / 255]

    const mix = []
    mix[3] = 1 - (1 - added[3]) * (1 - base[3])
    mix[0] = Math.round(
      (added[0] * added[3]) / mix[3] +
        (base[0] * base[3] * (1 - added[3])) / mix[3]
    ) // red
    mix[1] = Math.round(
      (added[1] * added[3]) / mix[3] +
        (base[1] * base[3] * (1 - added[3])) / mix[3]
    ) // green
    mix[2] = Math.round(
      (added[2] * added[3]) / mix[3] +
        (base[2] * base[3] * (1 - added[3])) / mix[3]
    )
    mix[3] = 255

    console.log(mix)

    return new Color(mix)
  }

  public checkPointInside(x: number, y: number) {
    x -= this.x
    y -= this.y

    return (
      x >= 0 &&
      y >= 0 &&
      x <= this.bitmap!.width - 1 &&
      y <= this.bitmap!.height - 1
    )
  }

  dump(): OverlayInStorage {
    return {
      position: {
        x: this.x,
        y: this.y
      },
      opacity: this.opacity,
      data: this.data,
      name: this.imageName
    }
  }
}
