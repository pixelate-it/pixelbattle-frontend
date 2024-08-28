import { PaletteManager } from 'src/managers/palette'
import { AppCanvas } from '../AppCanvas'
import { AppConfig } from '../AppConfig'
import { AppViewport } from './AppViewport'
import { AppLogic } from '../AppLogic'
import { PickerStore } from 'src/managers/picker'

export class AppMovement {
  static startX = 0
  static startY = 0

  // For touch pad
  // For dragging
  static initialViewportX = 0
  static initialViewportY = 0
  // For scaling
  static initialCenterViewportX = 0
  static initialCenterViewportY = 0
  static initialViewportScale = 0
  static startDistanceBetweenTouches = 0
  static isPinching = false

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

    if (PickerStore.getState().isEnabled) {
      const color = AppCanvas.getPixel(x, y)
      PickerStore.setState({ isEnabled: false })
      if (color) PaletteManager.addAndSelect(color)
      return
    }

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

  static onTouchStart(event: TouchEvent) {
    const touches = event.changedTouches
    event.preventDefault()
    if (touches.length === 2) {
      this.isPinching = true
      this.startDistanceBetweenTouches = this.getDistance(touches)
      this.initialViewportScale = AppViewport.scale
      this.initialViewportX = AppViewport.x
      this.initialViewportY = AppViewport.y
      this.initialCenterViewportX = (touches[0].pageX + touches[1].pageX) / 2
      this.initialCenterViewportY = (touches[0].pageY + touches[1].pageY) / 2
    } else if (touches.length === 1 && !this.isPinching) {
      this.startX = touches[0].pageX
      this.startY = touches[0].pageY
      this.initialViewportX = AppViewport.x
      this.initialViewportY = AppViewport.y
    }
  }

  static onTouchEnd(event: TouchEvent) {
    event.preventDefault()
    if (event.touches.length === 0) this.isPinching = false
  }

  static onTouchCancel(event: TouchEvent) {}

  static onTouchMove(event: TouchEvent) {
    const touches = event.changedTouches
    event.preventDefault()
    if (this.isPinching && touches.length === 2) {
      const currentDistance = this.getDistance(touches)
      const zoom = currentDistance / this.startDistanceBetweenTouches
      const newScale = this.initialViewportScale * zoom

      if (newScale < AppConfig.zoom.min || newScale > AppConfig.zoom.max) return
      const currentCenterX = (touches[0].pageX + touches[1].pageX) / 2
      const currentCenterY = (touches[0].pageY + touches[1].pageY) / 2
      AppViewport.x =
        this.initialViewportX +
        (currentCenterX - this.initialCenterViewportX) /
          this.initialViewportScale
      AppViewport.y =
        this.initialViewportY +
        (currentCenterY - this.initialCenterViewportY) /
          this.initialViewportScale
      AppViewport.x = currentCenterX - zoom * (currentCenterX - AppViewport.x)
      AppViewport.y = currentCenterY - zoom * (currentCenterY - AppViewport.y)
      AppViewport.scale = newScale
    } else if (touches.length === 1 && !this.isPinching) {
      const deltaX = touches[0].pageX - this.startX
      const deltaY = touches[0].pageY - this.startY
      AppViewport.x = this.initialViewportX + deltaX / AppViewport.scale
      AppViewport.y = this.initialViewportY + deltaY / AppViewport.scale
      this.canvasDragged = true
    }
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

  private static getDistance(touches: TouchList) {
    const dx = touches[0].pageX - touches[1].pageX
    const dy = touches[0].pageY - touches[1].pageY
    return Math.sqrt(dx * dx + dy * dy)
  }
}
