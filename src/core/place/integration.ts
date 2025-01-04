import { InfoDaemon } from '../daemons/info'
import { InfoState } from '../daemons/types'
import { clearBuses } from './buses/clear'
import { DomEvents } from './buses/domEvents'
import { RenderEvents } from './buses/renderEvents'
import { movementPlugin } from './plugins/movement'
import { overlaysPlugin } from './plugins/overlays'
import { pickerPlugin } from './plugins/picker'
import { placePlugin } from './plugins/place'
import { pointerPlugin } from './plugins/pointer'
import { generateEvent } from './utils/generators'
import { WebGlGraphics } from './webgl'

export class PlaceIntegration {
  private animationFrameRef = 0

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly graphics = new WebGlGraphics(canvas)
  ) {
    movementPlugin()
    placePlugin()
    overlaysPlugin()
    pointerPlugin()
    pickerPlugin()
    InfoDaemon.on(this.infoLoaded)
    this.animationFrameRef = requestAnimationFrame(this.render)
  }

  public destroy() {
    InfoDaemon.off(this.infoLoaded)
    cancelAnimationFrame(this.animationFrameRef)
    clearBuses()
  }

  private infoLoaded = (state: InfoState) => {
    generateEvent(
      {
        canvasWidth: this.canvas.width,
        canvasHeight: this.canvas.height,
        placeWidth: state.canvas.width,
        placeHeight: state.canvas.height
      },
      RenderEvents.loadedEvent
    )
  }

  private render = (delta: number) => {
    generateEvent(
      {
        graphics: this.graphics,
        delta: delta
      },
      RenderEvents.renderEvent
    )
    this.animationFrameRef = requestAnimationFrame(this.render)
  }

  onWheel = (e: WheelEvent) => {
    generateEvent(e, DomEvents.wheelEvents)
  }
  onMouseDown = (e: MouseEvent) => {
    generateEvent(e, DomEvents.mouseDownEvents)
    this.canvas.style.cursor = 'grabbing'
  }
  onMouseUp = (e: MouseEvent) => {
    generateEvent(e, DomEvents.mouseUpEvents)
    this.canvas.style.cursor = 'crosshair'
  }
  onTouchStart = (e: TouchEvent) => {
    generateEvent(e, DomEvents.touchStartEvent)
  }
  onTouchEnd = (e: TouchEvent) => {
    generateEvent(e, DomEvents.touchEndEvent)
  }
  onTouchCancel = (e: TouchEvent) => {
    generateEvent(e, DomEvents.touchCancelEvent)
  }
  onTouchMove = (e: TouchEvent) => {
    generateEvent(e, DomEvents.touchMoveEvent)
  }
  onMouseMove = (e: MouseEvent) => {
    generateEvent(e, DomEvents.mouseMoveEvents)
  }
  onContextMenu = (e: MouseEvent) => {
    e.preventDefault()
  }
  onMouseEnter = () => {}
  onMouseLeave = (e: MouseEvent) => {
    generateEvent(e, DomEvents.mouseLeaveEvents)
  }
}
