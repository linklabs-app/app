import * as Trig from "./trig"

export function calculateCurvature(radius, distance, part) {
  const f = 360 / (2 * radius * Math.PI)

  const xA = f * distance * 2
  const xE = (180 - xA) / 2
  const xB = xA * part
  const xD = 180 - xB - xE

  const x = Trig.sin(xE) * radius / Trig.sin(xD)

  return [x, radius - x]
}