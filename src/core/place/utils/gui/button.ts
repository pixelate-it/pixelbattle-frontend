import Color from 'src/core/classes/primitives/Color'
import { WebGlGraphics } from '../../webgl'
import { GuiColorElement, GuiColor } from './colors'
import BasicGuiElement from './basic'

export default class GuiButton extends BasicGuiElement {
  width: number
  height: number
  x: number
  y: number
  onClick: () => void | null

  basicColor: Color
  hoverColor: Color
  pressColor: Color

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    onClick: () => void | null,
    color: GuiColorElement = GuiColor.Primary
  ) {
    super()
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.onClick = onClick
    this.basicColor = color.normal
    this.hoverColor = color.hover
    this.pressColor = color.press
  }

  render(graphics: WebGlGraphics): void {
    const currentColor = this.pressed
      ? this.pressColor
      : this.hover
        ? this.hoverColor
        : this.basicColor
    graphics.drawButton(
      this.x,
      this.y,
      this.width,
      this.height,
      currentColor,
      2,
      0.05
    )
  }
}
