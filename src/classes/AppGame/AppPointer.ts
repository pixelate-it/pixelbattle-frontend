import { AppColor } from '../AppCanvas/AppColor'

export class AppPointer {
  x = 0
  y = 0
  color: AppColor | undefined
  fillColor = 'black'
  strokeColor = 'white'
  isItInsideCanvas = false

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.fillColor
    ctx.strokeStyle = this.strokeColor
    ctx.lineWidth = 0.15
    ctx.strokeRect(this.x - 0.1, this.y - 0.1, 1 + 0.2, 1 + 0.2)
    ctx.fillRect(this.x - 0.1, this.y - 0.1, 1 + 0.2, 1 + 0.2)
  }

  onChangeColor(color: AppColor) {
    this.color = color
    this.fillColor = color.toRGB()
    this.strokeColor = color.getReadableColor().toRGB()
  }
}
