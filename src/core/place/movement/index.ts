import { PointerDaemon } from 'src/core/daemons/pointer'
import { Movement } from './movement'

export class PlaceMovement {
  constructor(private readonly canvas: HTMLCanvasElement) {}

  onWheel = (e: WheelEvent) => {
    Movement.onWheel(e)
  }

  onMouseDown = (e: MouseEvent) => {
    Movement.onMouseDown(e)
    this.canvas.style.cursor = 'grabbing'
  }

  onMouseUp = (e: MouseEvent) => {
    Movement.onMouseUp(e)
    this.canvas.style.cursor = 'crosshair'
  }

  onTouchStart = (e: TouchEvent) => {
    Movement.onTouchStart(e)
  }
  onTouchEnd = (e: TouchEvent) => {
    Movement.onTouchEnd(e)
  }
  onTouchCancel = (e: TouchEvent) => {
    Movement.onTouchCancel(e)
  }
  onTouchMove = (e: TouchEvent) => {
    Movement.onTouchMove(e)
  }

  onMouseMove = (e: MouseEvent) => {
    const result = Movement.onMouseMove(e)
    if (result) {
      const [x, y] = PointerDaemon.getState().coordinates
      if (x !== result[0] || y !== result[1])
        PointerDaemon.setCoordinates([result[0], result[1]])
    }
  }

  onContextMenu = (e: MouseEvent) => {
    Movement.onContextMenu(e)
  }

  onMouseEnter = () => {
    Movement.onMouseEnter()
  }

  onMouseLeave = () => {
    Movement.onMouseLeave()
  }
}
