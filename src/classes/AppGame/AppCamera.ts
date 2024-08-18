import { AppConfig } from '../AppConfig'

export class AppCamera {
  s = 1.2
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

  wheel(e: WheelEvent) {
    const zoom = e.deltaY < 0 ? 1.15 : 0.85
    const result = zoom * this.s
    if (result < AppConfig.zoom.min) return
    if (result > AppConfig.zoom.max) return
    const rect = this.canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    this.x = mouseX - zoom * (mouseX - this.x)
    this.y = mouseY - zoom * (mouseY - this.y)

    this.s *= zoom
  }
}
