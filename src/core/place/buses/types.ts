import { WebGlGraphics } from '../webgl'

export type EventBus<EventT> = Array<BasicEvent<EventT>>

export type BasicEvent<EventT> = (event: EventT) => boolean

export interface BasicPointerEvent {
  x: number
  y: number
  button?: number
}

export interface BasicRenderEvent {
  graphics: WebGlGraphics
  delta: number
}

export interface CanvasLoadedEvent {
  placeWidth: number
  placeHeight: number
}
