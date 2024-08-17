import { ColorArray } from 'src/types/canvas'

export default class AppChunk {
  x: number
  y: number
  width: number
  height: number
  imageData: ImageData
  renderBitmap: ImageBitmap | undefined
  isUpdating = false

  constructor(
    x: number,
    y: number,
    image: ImageData,
    width: number,
    height: number
  ) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.imageData = image
    this.updateBitmap()
  }

  async updateBitmap() {
    this.isUpdating = true
    this.renderBitmap = await createImageBitmap(this.imageData)
    this.isUpdating = false
  }

  render(ctx: CanvasRenderingContext2D) {
    if (this.renderBitmap) {
      ctx.beginPath()
      ctx.drawImage(this.renderBitmap, this.x, this.y)
      ctx.closePath()
    }
  }

  itInside(x: number, y: number) {
    return (
      x >= this.x &&
      y >= this.y &&
      x <= this.x + this.width &&
      y <= this.y + this.height
    )
  }

  putPixel(x: number, y: number, color: ColorArray) {
    const pos = (x - this.x + (y - this.y) * this.width) * 4

    const data = this.imageData.data
    data[pos] = color[0]
    data[pos + 1] = color[1]
    data[pos + 2] = color[2]
    Object.assign({ data }, this.imageData)

    if (!this.isUpdating) this.updateBitmap()
  }
}
