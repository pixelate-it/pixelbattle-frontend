import { OverlayImage } from 'src/core/classes/primitives/OverlayImage'
import { OverlaysDaemon } from 'src/core/daemons/overlays'
import { PaletteDaemon } from 'src/core/daemons/palette'

export class OverlaysControl {
  static processColorPick(x: number, y: number): boolean {
    if (OverlaysDaemon.image)
      if (OverlaysDaemon.mode === 0)
        return this.processForImage(x, y, OverlaysDaemon.image)
      else if (OverlaysDaemon.mode === 1)
        for (let i = 0; i < OverlaysDaemon.images.length; i++)
          if (this.processForImage(x, y, OverlaysDaemon.images[i])) return true
    return false
  }

  private static processForImage(x: number, y: number, image: OverlayImage) {
    if (image.checkPointInside(x, y)) {
      const color = image.getPixel(x, y)
      if (color && color.color[3] !== 0) {
        PaletteDaemon.addAndSelect(color)
        return true
      }
    }
    return false
  }
}
