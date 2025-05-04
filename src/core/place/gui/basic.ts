import { Vector } from '../../util/vector'
import { MouseEventGui } from '../utils/types'
import { WebGlGraphics } from '../webgl'
import { GuiContainer } from './container'

export abstract class BasicGuiElement {
  abstract width: number
  abstract height: number
  abstract x: number
  abstract y: number

  // Render Staff
  hover: boolean = false
  pressed: boolean = false

  abstract onClick(event: MouseEventGui): void
  abstract onMove(event: MouseEventGui): void
  abstract onMinorMove(event: MouseEventGui): void
  abstract onClickEnd(event: MouseEventGui): void
  abstract onMinorClickEnd(event: MouseEventGui): void

  abstract render(graphics: WebGlGraphics, parent?: GuiContainer): void

  isPointerInside(pointer: Vector, parent: GuiContainer) {
    const position = new Vector(this.x + parent.x, this.y + parent.y)
    const width = this.width
    const height = this.height
    const inside =
      pointer.x >= position.x &&
      pointer.x <= position.x + width &&
      pointer.y >= position.y &&
      pointer.y <= position.y + height

    this.hover = inside

    return inside
  }

  handlePointerMove(event: MouseEventGui) {
    this.pressed = true
    this.onClick(event)
  }

  handlePointerDown(event: MouseEventGui) {
    this.pressed = true
    this.onClick(event)
  }

  handlePointerUp(event: MouseEventGui) {
    this.pressed = false
    this.onClickEnd(event)
  }
}
