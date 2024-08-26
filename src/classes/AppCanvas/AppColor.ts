import { ColorArray } from 'src/types/canvas'

export class AppColor {
  color: number[] = []

  /**
   * @param color Hex Color
   */
  constructor(color?: string | ColorArray) {
    if (color)
      if (typeof color === 'string') {
        color = color.slice(1)
        while (color.length >= 2) {
          this.color.push(parseInt(color.substring(0, 2), 16))
          color = color.substring(2, color.length)
        }
      } else this.color = color
    else this.color = [0, 0, 0]
  }

  toRGB() {
    return `rgb(${this.color[0]}, ${this.color[1]}, ${this.color[2]})`
  }

  elementToHex(c: number) {
    const hex = c.toString(16)
    return hex.length == 1 ? '0' + hex : hex
  }

  toHex() {
    return `#${this.elementToHex(this.color[0])}${this.elementToHex(this.color[1])}${this.elementToHex(this.color[2])}`
  }

  equals(c: AppColor) {
    return !(
      this.color[0] !== c.color[0] ||
      this.color[1] !== c.color[1] ||
      this.color[2] !== c.color[2]
    )
  }
}
