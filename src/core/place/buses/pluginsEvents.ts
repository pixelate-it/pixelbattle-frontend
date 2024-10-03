import { BasicPointerEvent, EventBus } from './types'

export class PluginsEvents {
  public static clickStartEvents: EventBus<BasicPointerEvent> = []
  public static clickEndEvents: EventBus<BasicPointerEvent> = []
  public static pointerMoveEvents: EventBus<BasicPointerEvent> = []

  public static clear() {
    this.clickStartEvents = []
    this.clickEndEvents = []
    this.pointerMoveEvents = []
  }
}
