import { Viewport } from '../storage/viewport'
import { useLoaded, useRender } from '../utils/render/premitive'
import { CanvasStorage } from '../storage/canvas'

export const placePlugin = () => {
  useLoaded((event) => {
    let scale = event.canvasWidth / event.placeWidth
    if (scale > event.canvasHeight / event.placeHeight)
      scale = event.canvasHeight / event.placeHeight

    // x: x / Viewport.scale - Viewport.x,
    Viewport.renderScale = Viewport.scale = scale
    Viewport.renderX = Viewport.x =
      event.canvasWidth / Viewport.scale / 2 - event.placeWidth / 2
    Viewport.renderY = Viewport.y =
      event.canvasHeight / Viewport.scale / 2 - event.placeHeight / 2
  })

  useRender(({ graphics, delta }) => {
    // Viewport.clearTransform(ctx)

    // // ctx.imageSmoothingEnabled = false

    // // ctx.beginPath()
    // ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    // ctx.fillStyle = config.defaults.colors.background
    // ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    // ctx.closePath()

    // Viewport.applyTransform(ctx)
    Viewport.smoothMove(delta)

    const chunks = CanvasStorage.getChunks()
    graphics.preRender()
    // ctx.beginPath()
    // ctx.fillRect(0, 0, CanvasStorage.width, CanvasStorage.height)
    // ctx.closePath()
    for (const chunk of chunks) {
      graphics.drawImage(chunk.x, chunk.y, chunk.imageData)
    }
  })

  // Mod tools is not added. :)
  // useRender(
  //   ({ ctx }) => {
  //     const chunks = CanvasStorage.getChunks()
  //     for (const i in chunks) {
  //       const chunk = chunks[i]
  //       const o = Date.now() - chunk.lastUpdateTime
  //       if (o < 1000) {
  //         ctx.strokeStyle = `#DF0000`
  //         ctx.globalAlpha = 1 - o / 1000
  //         ctx.lineWidth = 1
  //         ctx.moveTo(chunk.x + 1, chunk.y + 0.5)
  //         ctx.lineTo(chunk.x - 0.5 + chunk.width, chunk.y + 0.5)
  //         ctx.lineTo(chunk.x - 0.5 + chunk.width, chunk.y - 0.5 + chunk.height)
  //         ctx.lineTo(chunk.x + 0.5, chunk.y - 0.5 + chunk.height)
  //         ctx.lineTo(chunk.x + 0.5, chunk.y)
  //         ctx.stroke()
  //         ctx.globalAlpha = 1
  //         ctx.lineWidth = 1
  //       }
  //     }
  //   },
  //   () => [false]
  // )
}
