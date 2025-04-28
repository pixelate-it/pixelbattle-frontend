import { Vector } from '../util/vector'
import { CanvasStorage } from './canvas'

export class Viewport {
  static scale = 1.2
  static x: number = 0
  static y: number = 0

  static renderScale = 1.2
  static renderX = 0
  static renderY = 0

  static minScale = 0
  static maxScale = 0

  static locked = false

  static worldWidth = 0
  static worldHeight = 0
  static get worldScreenWidth() {
    return this.screenWidth / this.scale
  }
  static get worldScreenHeight() {
    return this.screenHeight / this.scale
  }
  static screenWidth = 0
  static screenHeight = 0

  static minWidth = 0
  static maxWidth = 0
  static minHeight = 0
  static maxHeight = 0

  static focusOn(point: Vector, size: Vector) {
    const center = new Vector(point.x + size.x / 2, point.y + size.y / 2)
    this.fit(new Vector(size.x, size.y + 20))
    this.moveCenter(center)
  }

  static smoothMove() {
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

  static boundToCanvas(point: [number, number]): [number, number] {
    const width = CanvasStorage.width
    const height = CanvasStorage.height
    if (point[0] < 0) point[0] = 0
    if (point[0] > width - 1) point[0] = width - 1
    if (point[1] < 0) point[1] = 0
    if (point[1] > height - 1) point[1] = height - 1
    return point
  }

  static clampZoom() {
    let width = this.worldScreenWidth
    let height = this.worldScreenHeight
    let zoomed = false

    if (width < this.minWidth) {
      this.scale = this.screenWidth / this.minWidth
      width = this.worldScreenWidth
      height = this.worldScreenHeight
      zoomed = true
    }
    if (width > this.maxWidth) {
      this.scale = this.screenWidth / this.maxWidth
      width = this.worldScreenWidth
      height = this.worldScreenHeight
      zoomed = true
    }
    if (height < this.minHeight) {
      this.scale = this.screenHeight / this.minHeight
      width = this.worldScreenWidth
      height = this.worldScreenHeight
      zoomed = true
    }
    if (height > this.maxHeight) {
      this.scale = this.screenHeight / this.maxHeight
      zoomed = true
    }
    return zoomed
  }

  static fit(size: Vector) {
    let scaleX = this.screenWidth / size.x
    let scaleY = this.screenHeight / size.y
    if (scaleX < scaleY) {
      this.scale = scaleX
    } else {
      this.scale = scaleY
    }
  }

  static zoomPercent(percent: number) {
    this.scale += this.scale * percent
  }

  static moveCenter(point: Vector) {
    this.x = this.worldScreenWidth / 2 - point.x
    this.y = this.worldScreenHeight / 2 - point.y
  }

  static toTranslation(x: number, y: number) {
    return [
      (x + this.renderX) * this.renderScale,
      (y + this.renderY) * this.renderScale
    ]
  }

  static toScale(width: number, height: number) {
    return [width * this.renderScale, height * this.renderScale]
  }

  static toLocal(x: number, y: number): Vector {
    return new Vector(
      x / Viewport.scale - Viewport.x,
      y / Viewport.scale - Viewport.y
    )
  }

  static toLocalFloor(ix: number, iy: number) {
    const { x, y } = this.toLocal(ix, iy)
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
