import { CanvasStorage } from '../storage'
import { CanvasChunk } from '../storage/chunk'

export class CanvasRender {
  static render(ctx: CanvasRenderingContext2D) {
    const chunk = CanvasStorage.getChunks()
    ctx.beginPath()
    ctx.fillRect(0, 0, CanvasStorage.width, CanvasStorage.height)
    ctx.closePath()
    for (const i in chunk) {
      if (chunk[i].renderBitmap) {
        ctx.beginPath()
        ctx.drawImage(chunk[i].renderBitmap, chunk[i].x, chunk[i].y)
        ctx.closePath()
      }
    }
  }

  static renderModTools(ctx: CanvasRenderingContext2D, chunk: CanvasChunk) {
    const o = Date.now() - chunk.lastUpdateTime
    if (o < 1000) {
      ctx.strokeStyle = `#DF0000`
      ctx.globalAlpha = 1 - o / 1000
      ctx.lineWidth = 1
      ctx.moveTo(chunk.x + 1, chunk.y + 0.5)
      ctx.lineTo(chunk.x - 0.5 + chunk.width, chunk.y + 0.5)
      ctx.lineTo(chunk.x - 0.5 + chunk.width, chunk.y - 0.5 + chunk.height)
      ctx.lineTo(chunk.x + 0.5, chunk.y - 0.5 + chunk.height)
      ctx.lineTo(chunk.x + 0.5, chunk.y)
      ctx.stroke()
      ctx.globalAlpha = 1
      ctx.lineWidth = 1
    }
  }
}
