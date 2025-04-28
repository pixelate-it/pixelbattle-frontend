/**
 * General primitive to transform of color.
 */
export default class Color {
  public color: number[] = []

  /**
   * @param color HEX Color
   */
  constructor(color?: string | number[]) {
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

  /**
   * converts color to rgb format
   * @returns RGB string
   */
  toRGB() {
    return `rgb(${this.color[0]}, ${this.color[1]}, ${this.color[2]})`
  }

  /**
   * converts color to hex format
   * @returns HEX string
   */
  toHex() {
    return `#${this.elementToHex(this.color[0])}${this.elementToHex(this.color[1])}${this.elementToHex(this.color[2])}`
  }

  /**
   * Converts part of a color list to part of a hexadecimal string.
   * @param c
   * @returns
   */
  private elementToHex(c: number) {
    const hex = c.toString(16)
    return hex.length == 1 ? '0' + hex : hex
  }

  /**
   * Checks that a color matches this color
   * @param c
   * @returns
   */
  equals(c: Color) {
    return !(
      this.color[0] !== c.color[0] ||
      this.color[1] !== c.color[1] ||
      this.color[2] !== c.color[2]
    )
  }

  /**
   * Transforms colors to Gl format
   * @returns color in array
   */
  toGl(): number[] {
    return [
      this.color[0] / 255,
      this.color[1] / 255,
      this.color[2] / 255,
      this.color[3] ? this.color[3] : 1.0
    ]
  }

  /**
   * gives a color inversion depending on the brightness of the color.
   * @returns Color
   */
  getReadableColor(): Color {
    const [red, green, blue] = this.color

    // https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color/3943023#3943023
    const isBlack = red * 0.299 + green * 0.587 + blue * 0.114 > 186

    return isBlack ? new Color('#000000') : new Color('#ffffff')
  }
}
