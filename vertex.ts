import { Point, Polygon } from '@flatten-js/core'
;[0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]
const rect = (x: number, y: number, w: number, h: number) => [
  new Point(x, y),
  new Point(x + w, y),
  new Point(x, y + h),

  new Point(x + w, y),
  new Point(x, y + h),
  new Point(x + w, y + h)
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

  return new Point(cos * dx - sin * dy + cx, sin * dx + cos * dy + cy)
}

const triangle = (
  x: number,
  y: number,
  w: number,
  h: number,
  angle: number
) => {
  const p1 = new Point(x, y)
  const p2 = new Point(x + w, y)
  const p3 = new Point(x + w / 2, y + h)

  const centerX = (p1.x + p2.x + p3.x) / 3
  const centerY = (p1.y + p2.y + p3.y) / 3

  return [
    rotate(centerX, centerY, p1.x, p1.y, angle),
    rotate(centerX, centerY, p2.x, p2.y, angle),
    rotate(centerX, centerY, p3.x, p3.y, angle)
  ]
}

const OverlayTransform = [
  rect(0, 0, 5, 100),
  rect(5, 0, 90, 5),
  rect(95, 0, 5, 100),
  rect(5, 95, 90, 5),
  rect(46, 23, 8, 52),
  rect(25, 45, 21, 8),
  rect(54, 45, 21, 8),
  triangle(93, 40, 30, 24, 180 + 90)
  // new Polygon([
  //   new Point(46, 75),
  //   new Point(54, 75),
  //   new Point(54, 23),
  //   new Point(46, 23)
  // ])
  // // Прямоугольник горизонтальный по центру
  // new Polygon([
  //   new Point(76, 41),
  //   new Point(76, 49),
  //   new Point(24, 49),
  //   new Point(24, 41)
  // ]),
  // // Левая вертикальная полоска
  // new Polygon([
  //   new Point(0, 0),
  //   new Point(5, 0),
  //   new Point(5, 100),
  //   new Point(0, 100)
  // ]),
  // // Правая вертикальная полоска
  // new Polygon([
  //   new Point(95, 0),
  //   new Point(100, 0),
  //   new Point(100, 100),
  //   new Point(95, 100)
  // ]),
  // // Верхняя горизонтальная полоска
  // new Polygon([
  //   new Point(5, 0),
  //   new Point(95, 0),
  //   new Point(95, 5),
  //   new Point(5, 5)
  // ]),
  // // Нижняя горизонтальная полоска
  // new Polygon([
  //   new Point(5, 95),
  //   new Point(95, 95),
  //   new Point(95, 100),
  //   new Point(5, 100)
  // ])
]

function convertPolygonsToFloat32Array(polygons: Point[][]): Float32Array {
  const vertices: number[] = []

  polygons.forEach((polygon) => {
    polygon.forEach((vertex) => {
      vertices.push(vertex.x / 100, vertex.y / 100)
    })
  })

  return new Float32Array(vertices)
}

const array = convertPolygonsToFloat32Array(OverlayTransform)
console.log(array)
