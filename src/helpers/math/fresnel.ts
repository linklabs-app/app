const C = 299792458

export function calculateFresnelRadiusAt(frequency: number, distance: number, zone: number, x: number) {
  const d1 = distance * x
  const d2 = distance * (1 - x)

  const t = zone * d1 * d2 * C
  const b = distance * frequency

  const r = Math.sqrt(t / b)

  return r
}
