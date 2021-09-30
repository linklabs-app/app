import { rEarth } from "../constants"
import { calculateCurvature } from "./curvature"
import { calculateFresnelRadius } from "./fresnel"
import { calculatePolygonDistance } from "./pythagoras"

export function pythagoreanDistance(curvedDistance: number) {
  return calculatePolygonDistance(rEarth, curvedDistance * 1000) / 1000
}

export function curvature(curvedDistance: number, progress = 0.5) {
  return calculateCurvature(rEarth, curvedDistance * 1000, progress).map(e => e / 1000)
}

export function fresnel(frequency: number, distance: number, progress: number, n = 1) {
  return calculateFresnelRadius(frequency, distance, progress, n)
}
