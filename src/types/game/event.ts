export type EventType =
  | 'pointer-move'
  | 'pointer-down'
  | 'pointer-up'
  | 'wheel'
  | 'canvas-loaded'

export interface AdditionalProps {
  canvasWidth: number
  canvasHeight: number
  canvasElement: HTMLCanvasElement
}

export interface AdditionalMouseProps extends AdditionalProps {
  x: number
  y: number
}

export interface EventListener<T extends Event, A extends AdditionalProps> {
  type: EventType
  callback: (event: T, additionalProps: A) => void
}
