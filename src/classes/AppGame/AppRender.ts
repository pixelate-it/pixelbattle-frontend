import { AppCanvas } from '../AppCanvas'
import { AppPointer } from './AppPointer'

export class AppRender {
  pointer = new AppPointer()

  constructor(private readonly ctx: CanvasRenderingContext2D) {}

  render() {
    AppCanvas.render(this.ctx)

    this.pointer.render(this.ctx)
  }
}
