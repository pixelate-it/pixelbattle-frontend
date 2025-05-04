import { Vector } from 'src/core/util/vector'
import { WebGlGraphics } from '../webgl'
import { BasicGuiElement } from './basic'

export class GuiContainer {
  elements: Array<BasicGuiElement>
  x: number
  y: number
  width: number
  height: number

  constructor(
    x: number,
    y: number,
    elements: Array<BasicGuiElement>,
    customCallback: (this: GuiContainer) => void
  ) {
    this.elements = elements
    this.x = x
    this.y = y
    let width = 0
    let height = 0
    this.elements.forEach((e) => {
      const sizeX = e.x + e.width
      const sizeY = e.y + e.height
      if (width < sizeX) width = sizeX
      if (height < sizeY) height = sizeY
    })
    this.width = width
    this.height = height
    customCallback.bind(this)()
  }

  render(graphics: WebGlGraphics) {
    this.elements.map((e) => e.render(graphics, this))
  }

  isPointerInside(pointer: Vector) {
    const position = new Vector(this.x, this.y)
    const width = this.width
    const height = this.height
    const inside =
      pointer.x >= position.x &&
      pointer.x <= position.x + width &&
      pointer.y >= position.y &&
      pointer.y <= position.y + height

    return inside
  }

  resize() {
    let width = 0,
      height = 0
    this.elements.forEach((e) => {
      const sizeX = e.x + e.width
      const sizeY = e.y + e.height
      if (width < sizeX) width = sizeX
      if (height < sizeY) height = sizeY
    })
    this.width = width
    this.height = height
  }

  handlePointerMinorMove(pointer: Vector) {
    for (const i in this.elements) this.elements[i].onMinorMove(pointer)
  }

  handlePointerDown(pointer: Vector) {
    for (const i in this.elements)
      if (this.elements[i].isPointerInside(pointer, this)) {
        this.elements[i].handlePointerDown(pointer)
        return true
      }
    return false
  }

  handlePointerUp(pointer: Vector) {
    for (const i in this.elements) {
      this.elements[i].onMinorClickEnd(pointer)
      if (this.elements[i].isPointerInside(pointer, this)) {
        this.elements[i].handlePointerUp(pointer)
        return true
      }
    }
    return false
  }

  getElementAt(pointer: Vector): false | [number, BasicGuiElement] {
    for (const i in this.elements)
      if (this.elements[i].isPointerInside(pointer, this)) {
        return [i as unknown as number, this.elements[i]]
      }
    return false
  }

  updateElement(id: number, element: BasicGuiElement) {
    this.elements[id] = element
  }

  unPressElements() {
    this.elements = this.elements.map((e) => {
      e.pressed = false
      e.hover = false
      return e
    })
  }
}
