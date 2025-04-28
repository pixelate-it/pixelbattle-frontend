import Color from 'src/core/util/сolor'
import { WebGlGraphics } from '../webgl'
import { BasicGuiElement } from './basic'
import { GuiContainer } from './container'
import { OverlayTransformCenter } from 'src/core/constants/vertex'
import { Rect } from 'src/core/util/rect'
import { Vector } from 'src/core/util/vector'
import { Viewport } from 'src/core/storage'

export class GuiOverlay extends BasicGuiElement {
  width: number = 0
  height: number = 0
  x: number = 0
  y: number = 7
  bgColor: Color = new Color('#000000')
  fgColor: Color = new Color('#ffffff')
  central: Rect = new Rect(new Vector(), new Vector())
  onClick = () => {
    Viewport.locked = true
    console.log('click')
  }
  onPressMove = () => {}
  onClickEnd = () => {
    Viewport.locked = false
  }

  render(graphics: WebGlGraphics, parent: GuiContainer): void {
    graphics.drawRect(
      this.x + parent.x,
      this.y + parent.y,
      this.width,
      this.height,
      this.bgColor,
      0.5
    )
    graphics.drawVerities(
      this.central.pos.x + parent.x,
      this.central.pos.y + parent.y + 7,
      this.central.size.x,
      this.central.size.y,
      this.fgColor,
      OverlayTransformCenter,
      'overlay',
      0.5
    )
  }

  resize(width: number, height: number) {
    this.width = width
    this.height = height

    let size = width

    if (height / size < width / size) {
      size *= height / size
      this.central.pos.x = width / 2 - size / 2
      this.central.pos.y = 0
    } else {
      size *= width / size
      this.central.pos.x = 0
      this.central.pos.y = height / 2 - size / 2
    }
    this.central.size.x = size
    this.central.size.y = size
  }
}
