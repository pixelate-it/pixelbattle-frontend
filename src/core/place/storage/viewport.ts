import { CanvasStorage } from './canvas'

export class Viewport {
  static scale = 1.2
  static x: number = 0
  static y: number = 0

  static locked = false

  static realScale: number = 0
  static realX: number = 0
  static realY: number = 0
  static startSlideTime: number = 0

  static applyTransform(ctx: CanvasRenderingContext2D) {
    this.realScale += (this.scale - this.realScale) * 0.3
    this.realX += (this.x - this.realX) * 0.3
    this.realY += (this.y - this.realY) * 0.3
    ctx.setTransform(
      this.realScale,
      0,
      0,
      this.realScale,
      this.realX,
      this.realY
    )
  }

  static clearTransform(ctx: CanvasRenderingContext2D) {
    ctx.resetTransform()
  }

  static transformCoords(x: number, y: number) {
    return {
      x: (x - this.x) / this.scale,
      y: (y - this.y) / this.scale
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

  static fix() {
    this.scale = Math.round(this.scale * 100) / 100
    this.x = Math.round(this.x * 100) / 100
    this.y = Math.round(this.y * 100) / 100
  }
}
