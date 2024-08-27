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

  getReadableColor() {
    const [red, green, blue] = this.color

    // https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color/3943023#3943023
    const isBlack = red * 0.299 + green * 0.587 + blue * 0.114 > 186

    return isBlack ? new AppColor('#000000') : new AppColor('#ffffff')
  }
}
