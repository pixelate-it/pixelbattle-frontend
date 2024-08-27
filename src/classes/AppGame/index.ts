import { InfoStore } from 'src/managers/info'
import { AppConfig } from '../AppConfig'
import { AppRender } from './AppRender'
import { PaletteStore } from 'src/managers/palette'
import { AppViewport } from './AppViewport'
import { AppMovement } from './AppMovement'

export class AppGame {
  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly ctx: CanvasRenderingContext2D = canvas.getContext('2d')!,
    private readonly renderer = new AppRender(ctx)
  ) {
    InfoStore.subscribe((v) => {
      if (v)
        if (!Number.isNaN(v.canvas.width) && !Number.isNaN(v.canvas.height))
          AppViewport.centerOfImage(canvas, v.canvas.width, v.canvas.height)
    })
    PaletteStore.subscribe((v) =>
      this.renderer.pointer.onChangeColor(v.selected)
    )
  }

  render() {
    const ctx = this.ctx
    ctx.imageSmoothingEnabled = false

    ctx.beginPath()
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.fillStyle = AppConfig.defaults.colors.background
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.closePath()

    AppViewport.applyTransform(ctx)

    this.renderer.render()

    AppViewport.clearTransform(ctx)
  }

  onWheel = (e: WheelEvent) => {
    AppMovement.onWheel(e)
  }

  onMouseDown = (e: MouseEvent) => {
    AppMovement.onMouseDown(e)
    this.canvas.style.cursor = 'grabbing'
  }

  onMouseUp = (e: MouseEvent) => {
    AppMovement.onMouseUp(e)
    this.canvas.style.cursor = 'crosshair'
  }

  onMouseMove = (e: MouseEvent) => {
    const result = AppMovement.onMouseMove(e)
    if (result) {
      this.renderer.pointer.x = result[0]
      this.renderer.pointer.y = result[1]
    }
  }

  onContextMenu = (e: MouseEvent) => {
    AppMovement.onContextMenu(e)
  }

  onMouseEnter = () => {
    AppMovement.onMouseEnter()
  }

  onMouseLeave = () => {
    AppMovement.onMouseLeave()
  }
}
