import { config } from 'src/config'
import { CanvasRender } from './canvas'
import { AppPointer } from './pointer'
import { Viewport } from './viewport'
import { Overlays } from './overlays'

export class PlaceRender {
  pointer = new AppPointer()

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly ctx: CanvasRenderingContext2D = canvas.getContext('2d')!
  ) {}

  render() {
    const ctx = this.ctx
    ctx.imageSmoothingEnabled = false

    ctx.beginPath()
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.fillStyle = config.defaults.colors.background
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.closePath()

    Viewport.applyTransform(ctx)

    CanvasRender.render(this.ctx)

    Overlays.render(this.ctx)

    this.pointer.render(this.ctx)

    Viewport.clearTransform(ctx)
  }
}
