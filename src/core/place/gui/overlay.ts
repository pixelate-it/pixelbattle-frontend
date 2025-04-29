import Color from 'src/core/util/сolor'
import { WebGlGraphics } from '../webgl'
import { BasicGuiElement } from './basic'
import { GuiContainer } from './container'
import {
  OverlayTransformCenter,
  OverlayTransformCorners
} from 'src/core/constants/vertex'
import { Rect } from 'src/core/util/rect'
import { Vector } from 'src/core/util/vector'
import { Viewport } from 'src/core/storage'
import { MouseEventGui } from '../utils/types'
import { OverlaysDaemon } from 'src/core/daemons/overlays'

const cSize = 17

export class GuiOverlay extends BasicGuiElement {
  width: number = 0
  height: number = 0
  x: number = 0
  y: number = 7
  bgColor: Color = new Color('#000000')
  fgColor: Color = new Color('#ffffff')
  central: Rect = new Rect(new Vector(), new Vector())
  cornersVisible: boolean = true
  pressed = false
  startPointerPos = new Vector()
  oldPos = new Vector()

  corners: Rect[] = [
    new Rect(new Vector(), new Vector(cSize, cSize)),
    new Rect(new Vector(), new Vector(cSize, cSize)),
    new Rect(new Vector(), new Vector(cSize, cSize)),
    new Rect(new Vector(), new Vector(cSize, cSize))
  ]

  render(graphics: WebGlGraphics, parent: GuiContainer): void {
    graphics.drawRect(
      this.x + parent.x,
      this.y + parent.y,
      this.width,
      this.height,
      this.bgColor,
      0.75
    )
    graphics.drawVerities(
      this.central.pos.x + parent.x,
      this.central.pos.y + parent.y + 7,
      this.central.size.x,
      this.central.size.y,
      this.fgColor,
      OverlayTransformCenter,
      'overlay',
      1
    )

    if (this.cornersVisible)
      for (let i = 0; i < this.corners.length; i++) {
        const corner = this.corners[i]
        graphics.drawVerities(
          corner.pos.x + parent.x,
          corner.pos.y + parent.y + 7,
          corner.size.x,
          corner.size.y,
          this.fgColor,
          OverlayTransformCorners[i],
          'overlay-corner-' + i,
          1
        )
      }
  }

  onClick({ x, y }: MouseEventGui) {
    Viewport.locked = true
    this.pressed = true
    const overlay = OverlaysDaemon.currentOverlay
    this.startPointerPos.x = x
    this.startPointerPos.y = y
    this.oldPos.x = overlay.x
    this.oldPos.y = overlay.y
  }

  onMove({ x, y }: MouseEventGui) {
    if (this.pressed) {
      const offsetX = this.startPointerPos.x - x
      const offsetY = this.startPointerPos.y - y

      OverlaysDaemon.setOverlayPosition(
        this.oldPos.x - offsetX,
        this.oldPos.y - offsetY
      )
    }
  }

  onClickEnd() {
    Viewport.locked = false
    this.pressed = false
    const position = OverlaysDaemon.currentOverlay
    OverlaysDaemon.setOverlayPosition(
      Math.floor(position.x),
      Math.floor(position.y)
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

    // const coefficient = cSize / (width / 1.5)

    let i = 0
    if (cSize <= width / 2 || cSize <= height / 2) {
      for (let y = 0; y <= height; y += height - 2.89)
        for (let x = 0; x <= width; x += width - 2.89) {
          if (i > 3) return
          const corner = this.corners[i]
          corner.pos.x = x
          corner.pos.y = y
          i++
        }

      this.cornersVisible = true
    } else this.cornersVisible = false
    // for (let y = 0; y <= height; y += height - 2.89)
    //   for (let x = 0; x <= width; x += width - 2.89) {
    //     if (i > 3) return
    //     const corner = this.corners[i]
    //     const size = cSize / coefficient
    //     corner.size.x = size + 1
    //     corner.size.y = size + 1
    //     corner.pos.x = x
    //     corner.pos.y = y
    //     i++
    //   }
  }
}
