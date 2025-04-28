import { InfoDaemon } from '../daemons/info'
import { InfoState } from '../daemons/types'
import { clearBuses } from './buses'
import { DomEvents } from './buses'
import { RenderEvents } from './buses'
import {
  pickerPlugin,
  placePlugin,
  pointerPlugin,
  movementPlugin,
  guiPlugin,
  overlaysPlugin
} from './plugins'
import { DomEventError, RenderError } from '../util/errors'
import { generateEvent } from './utils/generators'
import { WebGlGraphics } from './webgl'
import { ErrorDaemon } from '../daemons/error'

export class PlaceIntegration {
  private animationFrameRef = 0
  private oldTime: number = Date.now()

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly graphics = new WebGlGraphics(canvas)
  ) {
    movementPlugin()
    placePlugin()
    overlaysPlugin()
    pointerPlugin()
    guiPlugin()
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
        placeWidth: state.canvas.width,
        placeHeight: state.canvas.height
      },
      RenderEvents.loadedEvent
    )
  }

  private render = () => {
    const time = Date.now()
    const delta = time - this.oldTime
    this.oldTime = time
    generateEvent(
      {
        graphics: this.graphics,
        delta
      },
      RenderEvents.renderEvent,
      RenderError
    )
    if (!ErrorDaemon.state.isErrored)
      this.animationFrameRef = requestAnimationFrame(this.render)
  }

  onWheel = (e: WheelEvent) => {
    generateEvent(e, DomEvents.wheelEvents, DomEventError)
  }
  onMouseDown = (e: MouseEvent) => {
    generateEvent(e, DomEvents.mouseDownEvents, DomEventError)
    this.canvas.style.cursor = 'grabbing'
  }
  onMouseUp = (e: MouseEvent) => {
    generateEvent(e, DomEvents.mouseUpEvents, DomEventError)
    this.canvas.style.cursor = 'crosshair'
  }
  onTouchStart = (e: TouchEvent) => {
    generateEvent(e, DomEvents.touchStartEvent, DomEventError)
  }
  onTouchEnd = (e: TouchEvent) => {
    generateEvent(e, DomEvents.touchEndEvent, DomEventError)
  }
  onTouchCancel = (e: TouchEvent) => {
    generateEvent(e, DomEvents.touchCancelEvent, DomEventError)
  }
  onTouchMove = (e: TouchEvent) => {
    generateEvent(e, DomEvents.touchMoveEvent, DomEventError)
  }
  onMouseMove = (e: MouseEvent) => {
    generateEvent(e, DomEvents.mouseMoveEvents, DomEventError)
  }
  onContextMenu = (e: MouseEvent) => {
    e.preventDefault()
  }
  onMouseEnter = () => {}
  onMouseLeave = (e: MouseEvent) => {
    generateEvent(e, DomEvents.mouseLeaveEvents, DomEventError)
  }
}
