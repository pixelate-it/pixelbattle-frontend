import { AppColor } from './AppColor'

export default class AppChunk {
  x: number
  y: number
  width: number
  height: number
  imageData: ImageData
  renderBitmap: ImageBitmap | undefined
  isUpdating = false
  lastUpdateTime = 0

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

  renderTools(ctx: CanvasRenderingContext2D) {
    const o = Date.now() - this.lastUpdateTime
    if (o < 1000) {
      ctx.strokeStyle = `#D80000`
      ctx.globalAlpha = 1 - o / 1000
      ctx.lineWidth = 1
      ctx.moveTo(this.x - 0.5, this.y - 0.5)
      ctx.lineTo(this.x - 0.5 + this.width, this.y - 0.5)
      ctx.lineTo(this.x - 0.5 + this.width, this.y - 0.5 + this.height)
      ctx.lineTo(this.x - 0.5, this.y - 0.5 + this.height)
      ctx.lineTo(this.x - 0.5, this.y - 0.5)
      ctx.stroke()
      ctx.globalAlpha = 1
      ctx.lineWidth = 1
    }
  }

  itInside(x: number, y: number) {
    return (
      x >= this.x &&
      y >= this.y &&
      x <= this.x + this.width - 1 &&
      y <= this.y + this.height - 1
    )
  }

  putPixel(x: number, y: number, color: AppColor) {
    const pos = (x - this.x + (y - this.y) * this.width) * 4

    const data = this.imageData.data
    data[pos] = color.color[0]
    data[pos + 1] = color.color[0]
    data[pos + 2] = color.color[0]
    Object.assign({ data }, this.imageData)

    if (!this.isUpdating) this.updateBitmap()
    this.lastUpdateTime = Date.now()
  }

  getPixel(x: number, y: number) {
    const pos = (x - this.x + (y - this.y) * this.width) * 4

    const data = this.imageData.data
    return new AppColor([data[pos], data[pos + 1], data[pos + 2]])
  }
}
