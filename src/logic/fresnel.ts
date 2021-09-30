import { c } from "../constants"

export function calculateFresnelRadius(freq, distance, part, zone) {
  const d1 = distance * part
  const d2 = distance * (1 - part)

  const t = zone * d1 * d2 * c
  const b = distance * freq

  const r = Math.sqrt(t / b)

  return r
}
