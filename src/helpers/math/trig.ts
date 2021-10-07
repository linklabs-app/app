function degToRad(deg: number) {
  return deg * Math.PI / 180
}

export function sin(deg: number) {
  return Math.sin(degToRad(deg))
}
