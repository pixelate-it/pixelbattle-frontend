import { ColorArray } from 'src/types/canvas'

export class AppColor {
  color: number[] = []

  /**
   * @param color Hex Color
   */
  constructor(color?: string | ColorArray) {
    if (color)
      if (typeof color === 'string')
        while (color.length >= 2) {
          this.color.push(parseInt(color.substring(0, 2), 16))
          color = color.substring(2, color.length)
        }
      else this.color = color
    else this.color = [0, 0, 0]
  }

  toRGB() {
    return `rgb(${this.color[0]}, ${this.color[1]}, ${this.color[2]})`
  }

  toHex() {
    return `#${this.color[0].toString(16).toUpperCase()}${this.color[1].toString(16).toUpperCase()}${this.color[2].toString(16).toUpperCase()}`
  }

  equals(c: AppColor) {
    return !(
      this.color[0] !== c.color[0] ||
      this.color[1] !== c.color[1] ||
      this.color[2] !== c.color[2]
    )
  }
}
