import { ColorArray } from 'src/types/canvas'
import { AppConfig } from '../AppConfig'
import AppChunk from './AppChunk'

export class AppCanvas {
  private static chunks: Array<AppChunk> = []
  static width = 0
  static height = 0

  static async process(blob: Blob) {
    const bitmap = await createImageBitmap(blob)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!

    this.width = canvas.width = bitmap.width
    this.height = canvas.height = bitmap.height
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

  static putPixel(x: number, y: number, color: ColorArray) {
    for (const i in this.chunks) {
      if (this.chunks[i].itInside(x, y)) {
        this.chunks[i].putPixel(x, y, color)
        return
      }
    }
  }

  static getPixel(x: number, y: number) {
    for (const i in this.chunks) {
      if (this.chunks[i].itInside(x, y)) {
        return this.chunks[i].getPixel(x, y)
      }
    }
  }

  static render(ctx: CanvasRenderingContext2D) {
    for (const i in this.chunks) {
      this.chunks[i].render(ctx)
    }
    for (const i in this.chunks) {
      this.chunks[i].renderTools(ctx)
    }
    return this
  }
}
