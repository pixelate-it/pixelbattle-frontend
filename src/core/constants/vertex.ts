const rect = (x: number, y: number, w: number, h: number) => [
  [x, y],
  [x + w, y],
  [x, y + h],

  [x + w, y],
  [x, y + h],
  [x + w, y + h]
]

const rotate = (
  cx: number,
  cy: number,
  x: number,
  y: number,
  angle: number
) => {
  const rad = (angle * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)

  const dx = x - cx
  const dy = y - cy

  return [
    Math.abs(cos * dx - sin * dy + cx),
    Math.abs(sin * dx + cos * dy + cy)
  ]
}

const triangle = (
  x: number,
  y: number,
  w: number,
  h: number,
  angle: number
) => {
  const p1 = [x, y]
  const p2 = [x + w, y]
  const p3 = [x + w / 2, y + h]

  const centerX = (p1[0] + p2[0] + p3[0]) / 3
  const centerY = (p1[1] + p2[1] + p3[1]) / 3

  return [
    rotate(centerX, centerY, p1[0], p1[1], angle),
    rotate(centerX, centerY, p2[0], p2[1], angle),
    rotate(centerX, centerY, p3[0], p3[1], angle)
  ]
}

export const OverlayTransformCenter = convertPolygonsToFloat32Array([
  // rect(0, 0, 5, 100),
  // rect(5, 0, 90, 5),
  // rect(95, 0, 5, 100),
  // rect(5, 95, 90, 5),
  rect(46, 25, 8, 50),
  rect(25, 45, 21, 8),
  rect(54, 45, 21, 8),
  triangle(68, 41, 30, 24, 180 + 90),
  triangle(2, 41, 30, 24, 90),
  triangle(35, 7, 30, 27, 180),
  triangle(35, 75, 30, 24, 0)
])

export const OverlayTransformCorners = [
  [rect(0, 0, 5, 17), rect(5, 0, 12, 5)],
  [rect(0, 0, 12, 5), rect(12, 0, 5, 17)],
  [rect(0, 0, 5, 17), rect(5, 12, 12, 5)],
  [rect(0, 12, 12, 5), rect(12, 0, 5, 17)]
].map((e) => convertPolygonsToFloat32Array(e))

export const ScreenshotTransformArrows = [
  [triangle(0, 0, 22, 13, 0)],
  [triangle(0, 0, 22, 13, 180)],
  [triangle(0, 0, 22, 13, 90)],
  [triangle(0, 0, 22, 13, 270)]
].map((e) => convertPolygonsToFloat32Array(e))

function convertPolygonsToFloat32Array(polygons: number[][][]): Float32Array {
  const vertices: number[] = []

  polygons.forEach((polygon) => {
    polygon.forEach((vertex) => {
      vertices.push(vertex[0] / 100, vertex[1] / 100)
    })
  })

  return new Float32Array(vertices)
}
