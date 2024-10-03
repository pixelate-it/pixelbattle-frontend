import { config } from 'src/config'
import Color from 'src/core/classes/primitives/Color'
import { CanvasChunk } from './chunk'

export class CanvasStorage {
  private static chunks: Array<CanvasChunk> = []
  static width = 0
  static height = 0

  /**
   * Process canvas image into canvas on game
   * @param blob Blob of loaded from api image
   */
  static async process(blob: Blob) {
    const bitmap = await createImageBitmap(blob)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!

    this.width = canvas.width = bitmap.width
    this.height = canvas.height = bitmap.height
    ctx.drawImage(bitmap, 0, 0)

    for (let x = 0; x < canvas.width; x += config.chunks.chunkWidth) {
      for (let y = 0; y < canvas.height; y += config.chunks.chunkHeight) {
        const realWidth =
          x + config.chunks.chunkWidth > canvas.width
            ? Math.abs(x - canvas.width)
            : config.chunks.chunkWidth
        const realHeight =
          y + config.chunks.chunkHeight > canvas.height
            ? Math.abs(y - canvas.height)
            : config.chunks.chunkHeight

        this.chunks.push(
          new CanvasChunk(
            x,
            y,
            ctx.getImageData(x, y, realWidth, realHeight),
            realWidth,
            realHeight
          )
        )
      }
    }
  }

  /**
   * Puts pixel inside canvas
   * @param x number
   * @param y number
   * @param color Color
   */
  static putPixel(x: number, y: number, color: Color) {
    for (const i in this.chunks) {
      if (this.chunks[i].itInside(x, y)) {
        this.chunks[i].putPixel(x, y, color)
        return
      }
    }
  }

  /**
   * Gets pixel from canvas
   * @param x number
   * @param y number
   * @returns Color
   */
  static getPixel(x: number, y: number) {
    for (const i in this.chunks) {
      if (this.chunks[i].itInside(x, y)) {
        return this.chunks[i].getPixel(x, y)
      }
    }
  }

  static getChunks() {
    return this.chunks
  }
}
