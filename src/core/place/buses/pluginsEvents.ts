import { BasicPointerEvent, EventBus } from './types'

export class PluginsEvents {
  public static clickStartEvents: EventBus<BasicPointerEvent> = []
  public static clickEndEvents: EventBus<BasicPointerEvent> = []
  public static clickGuarantiedEndEvents: EventBus<BasicPointerEvent> = []
  public static pointerMoveEvents: EventBus<BasicPointerEvent> = []
  public static draggedEvents: EventBus<{ current: boolean }> = []

  public static clear() {
    this.clickStartEvents = []
    this.clickEndEvents = []
    this.pointerMoveEvents = []
  }
}
