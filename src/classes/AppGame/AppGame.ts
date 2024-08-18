import { AppCanvas } from '../AppCanvas'
import { AppConfig } from '../AppConfig'
import { AppRequests } from '../AppRequests'
import { AppCamera } from './AppCamera'
import { AppMovement } from './AppMovement'
import { AppPointer } from './AppPointer'

export class AppGame {
  appCanvas = new AppCanvas()
  appMovement = new AppMovement()
  appPointer = new AppPointer()
  lastTime = 0

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly ctx: CanvasRenderingContext2D = canvas.getContext('2d')!,
    private appCamera = new AppCamera(canvas)
  ) {
    this.canvas.style.cursor = 'crosshair'
    AppRequests.pixels().then(async (v) => {
      this.appCanvas = await this.appCanvas.process(v)
      const i = await createImageBitmap(v)
      this.appCamera.centerOfImage(i.width, i.height)
    })
  }

  render(timestamp: number) {
    const ctx = this.ctx
    // const delta = timestamp - this.lastTime!
    this.lastTime = timestamp
    ctx.imageSmoothingEnabled = false

    ctx.beginPath()
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.fillStyle = AppConfig.defaults.colors.background
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.closePath()

    this.appCamera.apply(ctx)

    this.appCanvas.render(ctx)

    this.appPointer.render(ctx)

    this.appCamera.clear(ctx)
  }

  onWheel = (e: WheelEvent) => {
    this.appCamera.wheel(e)
  }

  onMouseDown = (e: MouseEvent) => {
    this.appMovement.mouseDown = true
    this.appMovement.startX = (e.clientX - this.appCamera.x) / this.appCamera.s
    this.appMovement.startY = (e.clientY - this.appCamera.y) / this.appCamera.s
    this.canvas.style.cursor = 'grabbing'

    if (e.button == 2) {
      const color = this.appCanvas.getPixel(
        this.appPointer.x,
        this.appPointer.y
      )
      console.log(color, this.appPointer)
      if (!color) return
      this.appPointer.updateColor(color)
    }
  }

  onMouseUp = () => {
    this.appMovement.mouseDown = false
    this.canvas.style.cursor = 'crosshair'
  }

  onMouseMove = (e: MouseEvent) => {
    if (this.appMovement.mouseDown) {
      this.appCamera.x = e.clientX - this.appMovement.startX * this.appCamera.s
      this.appCamera.y = e.clientY - this.appMovement.startY * this.appCamera.s
    } else {
      this.movePointer(e)
    }
    return [this.appPointer.x, this.appPointer.y]
  }

  onContextMenu = (e: Event) => {
    e.preventDefault()
  }

  movePointer(e: MouseEvent) {
    const pointerX = Math.floor(
      (e.clientX - this.appCamera.x + 1) / this.appCamera.s
    )
    const pointerY = Math.floor(
      (e.clientY - this.appCamera.y + 1) / this.appCamera.s
    )
    if (
      pointerX < 0 ||
      pointerY < 0 ||
      pointerX > this.appCanvas.width - 1 ||
      pointerY > this.appCanvas.height - 1
    ) {
      this.appPointer.inside = false
      return
    }
    this.appPointer.inside = true

    this.appPointer.x = pointerX
    this.appPointer.y = pointerY
  }
}
