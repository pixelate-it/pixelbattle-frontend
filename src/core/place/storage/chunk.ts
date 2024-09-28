import Color from 'src/core/classes/primitives/Color'

export class CanvasChunk {
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

  itInside(x: number, y: number) {
    return (
      x >= this.x &&
      y >= this.y &&
      x <= this.x + this.width - 1 &&
      y <= this.y + this.height - 1
    )
  }

  putPixel(x: number, y: number, color: Color) {
    const pos = (x - this.x + (y - this.y) * this.width) * 4

    const data = this.imageData.data
    data[pos] = color.color[0]
    data[pos + 1] = color.color[1]
    data[pos + 2] = color.color[2]
    Object.assign({ data }, this.imageData)

    if (!this.isUpdating) this.updateBitmap()
    this.lastUpdateTime = Date.now()
  }

  getPixel(x: number, y: number) {
    const pos = (x - this.x + (y - this.y) * this.width) * 4

    const data = this.imageData.data
    console.log(data[pos], data[pos + 1], data[pos + 2])
    return new Color([data[pos], data[pos + 1], data[pos + 2]])
  }
}
