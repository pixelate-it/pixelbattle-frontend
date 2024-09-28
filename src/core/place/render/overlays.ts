import { OverlaysDaemon } from 'src/core/daemons/overlays'

export class Overlays {
  static render(ctx: CanvasRenderingContext2D) {
    const state = OverlaysDaemon.getState()

    if (state.mode === 1) {
      for (let i = 0; i < state.images.length; i++) {
        const image = state.images[i]
        ctx.beginPath()
        if (image.bitmap) {
          ctx.globalAlpha = image.opacity / 100
          // ctx.strokeStyle = 'black'
          // ctx.lineWidth = 1
          ctx.drawImage(image.bitmap!, image.x, image.y)
          ctx.globalAlpha = 1
          // if (i === state.currentId)
          //   ctx.strokeRect(
          //     image.x,
          //     image.y,
          //     image.bitmap.width,
          //     image.bitmap.height
          //   )
        }
        ctx.closePath()
      }
    } else if (state.mode === 0 && OverlaysDaemon.image) {
      const image = OverlaysDaemon.image
      ctx.beginPath()
      ctx.globalAlpha = image.opacity / 100
      if (image.bitmap)
        ctx.drawImage(OverlaysDaemon.image.bitmap!, image.x, image.y)
      ctx.globalAlpha = 1
      ctx.closePath()
    }
  }
}
