import Color from 'src/core/classes/primitives/Color'
import { PaletteDaemon } from 'src/core/daemons/palette'
import { PointerDaemon } from 'src/core/daemons/pointer'

export class AppPointer {
  x = 0
  y = 0
  fillColor = 'black'
  strokeColor = 'white'
  isItInsideCanvas = false

  constructor() {
    PaletteDaemon.on((state) => {
      this.fillColor = state.selected.toHex()
      this.strokeColor = state.selected.getReadableColor().toHex()
    })
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.fillColor
    ctx.strokeStyle = this.strokeColor
    ctx.lineWidth = 0.15
    const [x, y] = PointerDaemon.getState().coordinates
    ctx.strokeRect(x, y, 1, 1)
    ctx.fillRect(x, y, 1, 1)
  }

  onChangeColor(color: Color) {
    this.fillColor = color.toRGB()
    this.strokeColor = color.getReadableColor().toRGB()
  }
}
