export const getColorArrayFromHex = (color: string) => {
  const result: Array<number> = []

  while (color.length >= 2) {
    result.push(parseInt(color.substring(0, 2), 16))
    color = color.substring(2, color.length)
  }
  return result
}
