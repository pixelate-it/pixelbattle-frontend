import { Viewport } from '../../storage/viewport'
import { Vector } from '../../../util/Vector'
import { WebGlGraphics } from '../../webgl'

export default abstract class BasicGuiElement {
  abstract width: number
  abstract height: number
  abstract x: number
  abstract y: number

  // Render Staff
  hover: boolean = false
  pressed: boolean = false

  abstract onClick: () => void | null

  abstract render(graphics: WebGlGraphics): void

  isPointerInside(pointer: Vector) {
    const position = new Vector(this.x, this.y)
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
