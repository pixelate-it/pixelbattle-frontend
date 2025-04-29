import { IconsType, WebGlGraphics } from '../webgl'
import { GuiColorElement, GuiColor } from './colors'
import { BasicGuiElement } from './basic'
import { GuiContainer } from './container'
import Color from 'src/core/util/сolor'

export class GuiButton extends BasicGuiElement {
  width: number
  height: number
  x: number
  y: number
  onClick: () => void | null = () => null
  onMove: () => void | null = () => null
  onClickEnd: () => void | null
  icon?: IconsType

  basicColor: Color
  hoverColor: Color
  pressColor: Color

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    onClick: () => void | null,
    icon?: IconsType,
    color: GuiColorElement = GuiColor.Primary
  ) {
    super()
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.onClickEnd = onClick
    this.basicColor = color.normal
    this.hoverColor = color.hover
    this.pressColor = color.press
    this.icon = icon
  }

  render(graphics: WebGlGraphics, parent: GuiContainer): void {
    const currentColor = this.pressed
      ? this.pressColor
      : this.hover
        ? this.hoverColor
        : this.basicColor
    let size = this.width < this.height ? this.width : this.height

    graphics.drawButton(
      this.x + parent.x,
      this.y + parent.y,
      this.width,
      this.height,
      currentColor,
      size / 5
    )
    if (this.icon) {
      const scale = 0.5
      graphics.drawIcon(
        this.x + parent.x + this.width / 2 - (size * scale) / 2,
        this.y + parent.y + this.height / 2 - (size * scale) / 2,
        size / 2,
        size / 2,
        new Color('#ffffff'),
        this.icon
      )
    }
  }
}
