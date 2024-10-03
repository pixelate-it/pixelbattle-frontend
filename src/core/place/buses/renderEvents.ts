import { BasicRenderEvent, CanvasLoadedEvent, EventBus } from './types'

export class RenderEvents {
  public static renderEvent: EventBus<BasicRenderEvent> = []
  public static loadedEvent: EventBus<CanvasLoadedEvent> = []

  public static clear() {
    this.renderEvent = []
    this.loadedEvent = []
  }
}
