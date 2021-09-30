import * as Trig from "./trig"

export function calculatePolygonDistance(radius, distance) {
  const f = 360 / (2 * radius * Math.PI)

  const xA = f * distance

  const l = 2 * radius * Trig.sin(xA / 2)

  return l
}