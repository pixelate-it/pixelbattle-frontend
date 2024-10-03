import { EventBus } from './types'

export class DomEvents {
  public static wheelEvents: EventBus<WheelEvent> = []
  public static mouseDownEvents: EventBus<MouseEvent> = []
  public static mouseUpEvents: EventBus<MouseEvent> = []
  public static mouseMoveEvents: EventBus<MouseEvent> = []
  public static mouseLeaveEvents: EventBus<MouseEvent> = []
  public static touchStartEvent: EventBus<TouchEvent> = []
  public static touchEndEvent: EventBus<TouchEvent> = []
  public static touchMoveEvent: EventBus<TouchEvent> = []
  public static touchCancelEvent: EventBus<TouchEvent> = []

  public static clear() {
    this.wheelEvents = []
    this.mouseDownEvents = []
    this.mouseUpEvents = []
    this.mouseMoveEvents = []
    this.mouseLeaveEvents = []
    this.touchStartEvent = []
    this.touchEndEvent = []
    this.touchMoveEvent = []
    this.touchCancelEvent = []
  }
}
