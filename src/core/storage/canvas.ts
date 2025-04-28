import { config } from 'src/config'
import { CanvasChunk } from './chunk'
import Color from '../util/сolor'

export class CanvasStorage {
  private static chunks: Array<CanvasChunk> = []
  static width = 0
  static height = 0

  static clear() {
    this.chunks = []
  }

  /**
   * Process canvas image into canvas on game
   * @param blob Blob of loaded from api image
   */
  static async process(blob: Blob) {
    const bitmap = await createImageBitmap(blob)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!

    const needToClear =
      this.width !== canvas.width || this.height !== canvas.height

    this.width = canvas.width = bitmap.width
    this.height = canvas.height = bitmap.height
    ctx.drawImage(bitmap, 0, 0)

    if (needToClear) this.chunks = []

    let index = 0

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

        if (needToClear)
          this.chunks.push(
            new CanvasChunk(
              x,
              y,
              ctx.getImageData(x, y, realWidth, realHeight),
              realWidth,
              realHeight
            )
          )
        else
          Object.assign(
            {
              imageData: ctx.getImageData(x, y, realWidth, realHeight)
            },
            this.chunks[index].imageData
          )
        index++
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
        this.chunks[i].putPixel.bind(this.chunks[i])(x, y, color)
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
