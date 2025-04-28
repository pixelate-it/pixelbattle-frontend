import { BasicRenderEvent, CanvasLoadedEvent, EventBus } from './types'

export class RenderEvents {
  public static renderEvent: EventBus<BasicRenderEvent> = []
  public static loadedEvent: EventBus<CanvasLoadedEvent> = []
  public static postRenderEvent: EventBus<BasicRenderEvent> = []

  public static clear() {
    this.renderEvent = []
    this.loadedEvent = []
    this.postRenderEvent = []
  }
}
