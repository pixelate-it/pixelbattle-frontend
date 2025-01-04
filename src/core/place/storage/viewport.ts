import { CanvasStorage } from './canvas'

export class Viewport {
  static scale = 1.2
  static x: number = 0
  static y: number = 0

  static renderScale = 1.2
  static renderX = 0
  static renderY = 0

  static locked = false

  static smoothMove(delta: number) {
    // in future
    // const smoothingFactor = 2.5
    // const timeFix = Math.min(delta / 1000 / 30, 1)

    // this.renderScale +=
    //   (this.scale - this.renderScale) * smoothingFactor * timeFix
    // this.renderX += (this.x - this.renderX) * smoothingFactor * timeFix
    // this.renderY += (this.y - this.renderY) * smoothingFactor * timeFix
    this.renderScale = this.scale
    this.renderX = this.x
    this.renderY = this.y
  }

  static transformCoords(x: number, y: number) {
    return {
      x: x / Viewport.scale - Viewport.x,
      y: y / Viewport.scale - Viewport.y
    }
  }

  static transformCoordsWithFloor(ix: number, iy: number) {
    const { x, y } = this.transformCoords(ix, iy)
    return { x: Math.floor(x), y: Math.floor(y) }
  }

  static checkPointInside(x: number, y: number) {
    if (
      x < 0 ||
      y < 0 ||
      x > CanvasStorage.width - 1 ||
      y > CanvasStorage.height - 1
    )
      return false
    return true
  }
}
