import { Vector } from '../../util/vector'
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

  abstract onClick: () => void | null
  abstract onPressMove: () => void | null
  abstract onClickEnd: () => void | null

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

  handlePointerDown() {
    this.pressed = true
  }

  handlePointerUp() {
    this.pressed = false
    this.onClick()
  }
}
