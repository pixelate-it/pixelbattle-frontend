export class AppCamera {
  s = 2
  x: number
  y: number

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.x = canvas.width / 2
    this.y = canvas.height / 2
  }

  centerOfImage(width: number, height: number) {
    this.x = this.canvas.width / 2 - (width / 2) * this.s
    this.y = this.canvas.height / 2 - (height / 2) * this.s
  }

  apply(ctx: CanvasRenderingContext2D) {
    ctx.setTransform(this.s, 0, 0, this.s, this.x, this.y)
  }

  clear(ctx: CanvasRenderingContext2D) {
    ctx.resetTransform()
  }
}
