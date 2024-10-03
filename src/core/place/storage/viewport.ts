import { CanvasStorage } from './canvas'

export class Viewport {
  static scale = 1.2
  static x: number = 0
  static y: number = 0

  static slideTo: number = 0
  static startSlideTime: number = 0

  static applyTransform(ctx: CanvasRenderingContext2D) {
    // this.scale = (this.slideTo - this.scale) * 0.1
    ctx.setTransform(
      this.scale,
      0,
      0,
      this.scale,
      Math.floor(this.x),
      Math.floor(this.y)
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
}
