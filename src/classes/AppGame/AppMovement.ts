import { PaletteManager } from 'src/managers/palette'
import { AppCanvas } from '../AppCanvas'
import { AppConfig } from '../AppConfig'
import { AppViewport } from './AppViewport'
import { AppLogic } from '../AppLogic'

export class AppMovement {
  static startX = 0
  static startY = 0
  static mouseDown = false
  static canvasDragged = false

  static onWheel(event: WheelEvent) {
    const zoom = event.deltaY < 0 ? 1.15 : 0.85
    const result = zoom * AppViewport.scale
    if (result < AppConfig.zoom.min) return
    if (result > AppConfig.zoom.max) return
    AppViewport.x = event.clientX - zoom * (event.clientX - AppViewport.x)
    AppViewport.y = event.clientY - zoom * (event.clientY - AppViewport.y)
    AppViewport.scale *= zoom
  }

  static onMouseDown(event: MouseEvent) {
    this.mouseDown = true
    const { x, y } = AppViewport.transformCoords(event.clientX, event.clientY)
    this.startX = x
    this.startY = y
  }

  static onMouseUp(event: MouseEvent) {
    this.mouseDown = false

    const { x, y } = AppViewport.transformCoordsWithFloor(
      event.clientX,
      event.clientY
    )

    if (!this.canvasDragged && AppViewport.checkPointInside(x, y)) {
      if (event.button === 2) {
        const color = AppCanvas.getPixel(x, y)
        if (!color) return
        PaletteManager.addAndSelect(color)
      }
      if (event.button === 0) {
        AppLogic.putPixel(x, y)
      }
    }

    this.canvasDragged = false
  }

  static onMouseMove(event: MouseEvent) {
    if (this.mouseDown) {
      AppViewport.x = event.clientX - this.startX * AppViewport.scale
      AppViewport.y = event.clientY - this.startY * AppViewport.scale
      this.canvasDragged = true
    } else {
      const { x, y } = AppViewport.transformCoordsWithFloor(
        event.clientX,
        event.clientY
      )
      if (!AppViewport.checkPointInside(x, y)) return

      return [x, y]
    }
  }

  static onContextMenu(e: Event) {
    e.preventDefault()
  }

  static onMouseEnter() {}

  static onMouseLeave() {
    this.mouseDown = false
    this.canvasDragged = false
  }
}
