export class AppColor {
  color: number[] = []

  /**
   * @param color Hex Color
   */
  constructor(color?: string) {
    if (color)
      while (color.length >= 2) {
        this.color.push(parseInt(color.substring(0, 2), 16))
        color = color.substring(2, color.length)
      }
    else this.color = [0, 0, 0]
  }

  toRGB() {
    return `rgb(${this.color[0]}, ${this.color[1]}, ${this.color[2]})`
  }
}
