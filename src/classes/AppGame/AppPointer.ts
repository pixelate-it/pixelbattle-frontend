import { ColorArray } from 'src/types/canvas'

export class AppPointer {
  x = 0
  y = 0
  color = 'black'
  outline = 'white'
  inside = false

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color
    ctx.strokeStyle = this.outline
    ctx.lineWidth = 0.1
    ctx.strokeRect(this.x, this.y, 1, 1)
    ctx.fillRect(this.x, this.y, 1, 1)
  }

  updateColor(color: ColorArray) {
    this.color = `rgb(${color[0]},${color[1]},${color[2]})`
    if (color[0] < 127 || color[1] < 127 || color[2] < 127)
      this.outline = 'white'
    else this.outline = 'black'
  }
}
