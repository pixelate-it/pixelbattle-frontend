export type EventBus<EventT> = Array<BasicEvent<EventT>>

export type BasicEvent<EventT> = (event: EventT) => boolean

export interface BasicPointerEvent {
  x: number
  y: number
  button?: number
}

export interface BasicRenderEvent {
  ctx: CanvasRenderingContext2D
  canvasWidth: number
  canvasHeight: number
}

export interface CanvasLoadedEvent {
  canvasWidth: number
  canvasHeight: number
  placeWidth: number
  placeHeight: number
}
