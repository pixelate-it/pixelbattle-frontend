import { AppConfig } from '../AppConfig'
import { InfoStore } from 'src/managers/info'

export class AppCamera {
  s = 1.2
  x: number
  y: number

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.x = canvas.width / 2
    this.y = canvas.height / 2
    InfoStore.subscribe((v) => {
      if (v)
        if (!Number.isNaN(v.canvas.width) && !Number.isNaN(v.canvas.height))
          this.centerOfImage(v.canvas.width, v.canvas.height)
    })
  }

  centerOfImage(width: number, height: number) {
    this.x = this.canvas.width / 2 - (width / 2) * this.s
    this.y = this.canvas.height / 2 - (height / 2) * this.s
  }

  apply(ctx: CanvasRenderingContext2D) {
    ctx.setTransform(
      Math.floor(this.s * 100) / 100,
      0,
      0,
      Math.floor(this.s * 100) / 100,
      Math.floor(this.x),
      Math.floor(this.y)
    )
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
