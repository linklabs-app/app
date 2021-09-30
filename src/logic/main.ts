import * as Trig from "./trig"
import { curvature, pythagoreanDistance, fresnel } from "./earth"

function elevationAt(part) {
  return 0
}

let div = document.querySelector("div")
let [canvas, canvas2]: Array<HTMLCanvasElement> = document.querySelectorAll("canvas") as any
let label = document.querySelector("p")
let ctx = canvas.getContext("2d")
let ctx2 = canvas2.getContext("2d")

let w = canvas.width
let h = canvas.height

let m = 30
let d = pythagoreanDistance(m)

let hLOS1 = 0.05
let hLOS2 = 0.16

let i = 0
let s = w * 1

let lw = -1
let lh = -1

let scale = 30
let dh = (d / w * h / scale)

let wpp = d / w
let hpp = dh / h

lw = -1
lh = -1

let distance = 10
let lastLine = 0
let increment = true

i = 0
while (i += 1) {
  let id = d / s * i

  let it = i / s

  let hLOS = hLOS1 * (1 - it) + hLOS2 * it

  let iw = w / d * id
  let ih = h - hLOS / hpp


  let f1 = fresnel(5 * 1000 ** 3, m * 1000, it, 1) / 1000
  let f2 = fresnel(5 * 1000 ** 3, m * 1000, it, 2) / 1000

  let elev = (curvature(m, i / s)[1] + elevationAt(i / s))

  let fh1t = hLOS + f1
  let fh1b = hLOS - f1
  let fh2t = hLOS + f2
  let fh2b = hLOS - f2

  let ld = 1

  if (lw !== -1) {
    if (increment) {
      if (lastLine === distance) {
        increment = false
      } else
        lastLine++

      ctx.fillStyle = elev >= fh1t ? "transparent" : "orange"
      ctx.fillRect(iw, ih - f1 / hpp, ld, ld)
      ctx.fillStyle = elev >= fh1b ? "transparent" : "orange"
      ctx.fillRect(iw, ih + f1 / hpp, ld, ld)

      ctx.fillStyle = elev >= fh2t ? "transparent" : "green"
      ctx.fillRect(iw, ih - f2 / hpp, ld, ld)
      ctx.fillStyle = elev >= fh2b ? "transparent" : "green"
      ctx.fillRect(iw, ih + f2 / hpp, ld, ld)

      lastLine++
    } else {
      if (lastLine === 0) {
        increment = true
      } else
        lastLine--
    }
    ctx.fillStyle = elev >= hLOS ? "transparent" : "maroon"
    ctx.fillRect(iw, ih + ld * 0.5, ld, ld)
  }

  lw = iw
  lh = ih

  if (i === s) break
}

div.addEventListener("mouseenter", (ev) => {
  label.classList.remove("hidden")
})

div.addEventListener("mouseleave", () => {
  label.classList.add("hidden")
})

canvas2.addEventListener("mousemove", (ev) => {
  const rect = canvas2.getBoundingClientRect()
  const x = ev.clientX - rect.left
  const y = ev.clientY - rect.top

  const it = x / w

  let ih = (curvature(m, it)[1] + elevationAt(it))
  label.style.top = Math.max(h - ih * scale, h) + "px"
  label.style.left = x + "px"

  const f3b = fresnel(5 * 1000 ** 3, m * 1000, it, 3) / 1000
  const f1b = fresnel(5 * 1000 ** 3, m * 1000, it, 1) / 1000

  const diff = h - (h / 2) - ih * scale

  ctx2.clearRect(0, 0, w, h)

  ctx.fillStyle = "black"
  ctx2.fillRect(x - 2, h - ih / hpp - 2, 4, 4)

  label.innerHTML = `
        Elevation: ${(ih * 1000).toFixed(2)}m<br>
        LOS Height: ${1}<br>
        1st Radius: ${(f1b * 1000).toFixed(2)}m<br>
        3rd Radius: ${(f3b * 1000).toFixed(2)}m`
})
