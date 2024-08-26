import { PaletteManager, PaletteStore } from 'src/managers/palette'
import { PointerManager } from 'src/managers/pointer'
import { ColorArray } from 'src/types/canvas'
import { AppColor } from '../AppCanvas/AppColor'
import { AppLogic } from '../AppLogic'

export class AppPointer {
  x = 0
  y = 0
  color = 'black'
  colorOriginal: AppColor | undefined
  outline = 'white'
  inside = false

  constructor() {
    PaletteStore.subscribe(
      (v) => (
        (this.color = v.selected.toRGB()), (this.colorOriginal = v.selected)
      )
    )
  }

  render(ctx: CanvasRenderingContext2D) {
    if (this.inside) {
      ctx.fillStyle = this.color
      ctx.strokeStyle = this.outline
      ctx.lineWidth = 0.15
      ctx.strokeRect(this.x - 0.1, this.y - 0.1, 1 + 0.2, 1 + 0.2)
      ctx.fillRect(this.x - 0.1, this.y - 0.1, 1 + 0.2, 1 + 0.2)
    }
  }

  updateColor(color: ColorArray) {
    this.color = `rgb(${color[0]},${color[1]},${color[2]})`
    const avg = (color[0] + color[1] + color[2]) / 3
    if (avg < 127) this.outline = 'white'
    else this.outline = 'black'

    PaletteManager.addAndSelect(new AppColor(color))
  }

  setPos(x: number, y: number) {
    if (x !== this.x || y !== this.y) PointerManager.setCoordinates([x, y])
    this.x = x
    this.y = y
  }

  putPixel() {
    AppLogic.putPixel(this.x, this.y)
  }
}
