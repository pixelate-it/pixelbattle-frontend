import { ColorArray } from 'src/types/canvas'
import { AppConfig } from '../AppConfig'
import AppChunk from './AppChunk'

export class AppCanvas {
  chunks: Array<AppChunk> = []
  empty = true

  async process(blob: Blob) {
    const bitmap = await createImageBitmap(blob)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    this.empty = false

    canvas.width = bitmap.width
    canvas.height = bitmap.height
    ctx.drawImage(bitmap, 0, 0)

    for (let x = 0; x < canvas.width; x += AppConfig.chunks.chunkWidth) {
      for (let y = 0; y < canvas.height; y += AppConfig.chunks.chunkHeight) {
        const realWidth =
          x + AppConfig.chunks.chunkWidth > canvas.width
            ? Math.abs(x - canvas.width)
            : AppConfig.chunks.chunkWidth
        const realHeight =
          y + AppConfig.chunks.chunkHeight > canvas.height
            ? Math.abs(y - canvas.height)
            : AppConfig.chunks.chunkHeight

        this.chunks.push(
          new AppChunk(
            x,
            y,
            ctx.getImageData(x, y, realWidth, realHeight),
            realHeight,
            realHeight
          )
        )
      }
    }
    return this
  }

  putPixel(x: number, y: number, color: ColorArray) {
    for (const i in this.chunks) {
      if (this.chunks[i].itInside(x, y)) {
        this.chunks[i].putPixel(x, y, color)
        return
      }
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    for (const i in this.chunks) {
      this.chunks[i].render(ctx)
    }
    return this
  }
}
