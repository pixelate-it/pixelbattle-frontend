import { OverlaysDaemon } from 'src/core/daemons/overlays'

export class Overlays {
  static render(ctx: CanvasRenderingContext2D) {
    const overlay = OverlaysDaemon.getState()

    if (overlay.image?.bitmap) {
      ctx.beginPath()
      ctx.globalAlpha = overlay.opacity! / 100
      ctx.drawImage(
        overlay.image!.bitmap!,
        Math.ceil(overlay.position!.x),
        Math.ceil(overlay.position!.y)
      )
      ctx.globalAlpha = 1
      ctx.closePath()
    }
  }
}
