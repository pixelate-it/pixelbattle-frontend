import { Viewport } from '../storage'

export class Vector {
  x: number
  y: number

  constructor(x?: number, y?: number) {
    this.x = x ?? 0
    this.y = y ?? 0
  }

  transformByViewport() {
    return new Vector(
      (this.x - Viewport.x) / Viewport.scale,
      (this.y - Viewport.y) / Viewport.scale
    )
  }

  diff(vec: Vector): Vector {
    return new Vector(this.x - vec.x, this.y - vec.y)
  }

  abs(): Vector {
    return new Vector(Math.abs(this.x), Math.abs(this.y))
  }

  multiply(factor: number): Vector {
    return new Vector(this.x * factor, this.y * factor)
  }
}
