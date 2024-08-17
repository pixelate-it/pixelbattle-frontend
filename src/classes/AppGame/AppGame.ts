import { AppCanvas } from '../AppCanvas'
import { AppConfig } from '../AppConfig'
import { AppRequests } from '../AppRequests'
import { AppCamera } from './AppCamera'
import { AppMovement } from './AppMovement'

export class AppGame {
  appCanvas = new AppCanvas()
  appMovement = new AppMovement()
  lastTime = 0

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly ctx: CanvasRenderingContext2D = canvas.getContext('2d')!,
    private appCamera = new AppCamera(canvas)
  ) {
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

    this.appCamera.clear(ctx)
  }

  onWheel = (e: WheelEvent) => {
    const zoom = e.deltaY < 0 ? 1.1 : 0.9

    const rect = this.canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    this.appCamera.x = mouseX - zoom * (mouseX - this.appCamera.x)
    this.appCamera.y = mouseY - zoom * (mouseY - this.appCamera.y)

    this.appCamera.s *= zoom
  }

  onMouseDown = (e: MouseEvent) => {
    this.appMovement.mouseDown = true
    this.appMovement.startX = e.clientX - this.appCamera.x
    this.appMovement.startY = e.clientY - this.appCamera.y
  }

  onMouseUp = () => {
    this.appMovement.mouseDown = false
  }

  onMouseMove = (e: MouseEvent) => {
    if (this.appMovement.mouseDown) {
      this.appCamera.x = e.clientX - this.appMovement.startX
      this.appCamera.y = e.clientY - this.appMovement.startY
    }
  }
}
