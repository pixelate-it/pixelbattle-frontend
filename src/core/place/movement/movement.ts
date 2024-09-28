import { config } from 'src/config'
import { Viewport } from '../render/viewport'
import { PaletteDaemon } from 'src/core/daemons/palette'
import { CanvasStorage } from '../storage'
import { ApiPlace } from '../api'
import { ToolsDaemon } from 'src/core/daemons/tools'
import { OverlaysDaemon } from 'src/core/daemons/overlays'

export class Movement {
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
    const result = zoom * Viewport.scale
    if (result < config.zoom.min) return
    if (result > config.zoom.max) return
    Viewport.x = event.clientX - zoom * (event.clientX - Viewport.x)
    Viewport.y = event.clientY - zoom * (event.clientY - Viewport.y)
    Viewport.scale *= zoom
  }

  static onMouseDown(event: MouseEvent) {
    this.mouseDown = true
    const { x, y } = Viewport.transformCoords(event.clientX, event.clientY)
    this.startX = x
    this.startY = y
  }

  static onMouseUp(event: MouseEvent) {
    this.mouseDown = false

    const { x, y } = Viewport.transformCoordsWithFloor(
      event.clientX,
      event.clientY
    )

    if (ToolsDaemon.getState().pickerIsEnabled) {
      const color = CanvasStorage.getPixel(x, y)
      ToolsDaemon.togglePicker()
      if (color) PaletteDaemon.addAndSelect(color)
      return
    }

    if (!this.canvasDragged && Viewport.checkPointInside(x, y)) {
      if (event.button === 2) {
        const overlays = OverlaysDaemon.getState()
        if (overlays.image)
          if (overlays.image.checkPointInside(x, y)) {
            const color = overlays.image.getPixel(x, y)
            if (color) PaletteDaemon.addAndSelect(color)
            return
          }
        const color = CanvasStorage.getPixel(x, y)
        if (!color) return
        PaletteDaemon.addAndSelect(color)
      }
      if (event.button === 0) {
        ApiPlace.putPixel(x, y)
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
      this.initialViewportScale = Viewport.scale
      this.initialViewportX = Viewport.x
      this.initialViewportY = Viewport.y
      this.initialCenterViewportX = (touches[0].pageX + touches[1].pageX) / 2
      this.initialCenterViewportY = (touches[0].pageY + touches[1].pageY) / 2
    } else if (touches.length === 1 && !this.isPinching) {
      this.startX = touches[0].pageX
      this.startY = touches[0].pageY
      this.initialViewportX = Viewport.x
      this.initialViewportY = Viewport.y
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

      if (newScale < config.zoom.min || newScale > config.zoom.max) return
      const currentCenterX = (touches[0].pageX + touches[1].pageX) / 2
      const currentCenterY = (touches[0].pageY + touches[1].pageY) / 2
      Viewport.x =
        this.initialViewportX +
        (currentCenterX - this.initialCenterViewportX) /
          this.initialViewportScale
      Viewport.y =
        this.initialViewportY +
        (currentCenterY - this.initialCenterViewportY) /
          this.initialViewportScale
      Viewport.x = currentCenterX - zoom * (currentCenterX - Viewport.x)
      Viewport.y = currentCenterY - zoom * (currentCenterY - Viewport.y)
      Viewport.scale = newScale
    } else if (touches.length === 1 && !this.isPinching) {
      const deltaX = touches[0].pageX - this.startX
      const deltaY = touches[0].pageY - this.startY
      Viewport.x = this.initialViewportX + deltaX / Viewport.scale
      Viewport.y = this.initialViewportY + deltaY / Viewport.scale
      this.canvasDragged = true
    }
  }

  static onMouseMove(event: MouseEvent) {
    if (this.mouseDown) {
      Viewport.x = event.clientX - this.startX * Viewport.scale
      Viewport.y = event.clientY - this.startY * Viewport.scale
      this.canvasDragged = true
    } else {
      const { x, y } = Viewport.transformCoordsWithFloor(
        event.clientX,
        event.clientY
      )
      if (!Viewport.checkPointInside(x, y)) return

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
