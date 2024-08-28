import { AppCanvas } from '../AppCanvas'

export class AppViewport {
  static scale = 1.2
  static x: number = 0
  static y: number = 0

  static centerOfImage(
    canvas: HTMLCanvasElement,
    width: number,
    height: number
  ) {
    let scale = canvas.width / width
    if (scale > canvas.height / height) scale = canvas.height / height
    this.scale = scale
    this.x = canvas.width / 2 - (width / 2) * this.scale
    this.y = canvas.height / 2 - (height / 2) * this.scale
  }

  static applyTransform(ctx: CanvasRenderingContext2D) {
    ctx.setTransform(
      Math.floor(this.scale * 100) / 100,
      0,
      0,
      Math.floor(this.scale * 100) / 100,
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
    if (x < 0 || y < 0 || x > AppCanvas.width - 1 || y > AppCanvas.height - 1)
      return false
    return true
  }
}
