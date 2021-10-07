import geographic from "geographiclib"

import * as Trig from "./trig"

const RADIUS = 6371000

type LatLng = [number, number]
type LatitudeLongitudeObject = {
  latitude: number,
  longitude: number
}
type LatLngObject = {
  lat: number,
  lng: number
}
type LatLongObject = {
  lat: number,
  long: number
}

type FnInputLatLng = LatLng | LatLngObject | LatLongObject | LatitudeLongitudeObject

export const earthRadius = RADIUS

export function toLatLng(x: FnInputLatLng): LatLng {
  if (
    typeof x[0] === "number" &&
    typeof x[1] === "number"
  ) {
    return [
      x[0],
      x[1]
    ]
  } else {
    return [
      (x as any).latitude ?? (x as any).lat,
      (x as any).longitude ?? (x as any).long ?? (x as any).lng
    ]
  }
}

export function getDistance(pos1: LatLng, pos2: LatLng): number {
  return geographic.Geodesic.WGS84.Inverse(...pos1, ...pos2).s12
}

export function getPolygonDistance(curvedDistance: number) {
  const f = 360 / (2 * RADIUS * Math.PI)

  const xA = f * curvedDistance

  const l = 2 * RADIUS * Trig.sin(xA / 2)

  return l
}

export function getCurvatureAt(curvedDistance: number, x = 0.5) {
  const f = 360 / (2 * RADIUS * Math.PI)

  const xA = f * curvedDistance * 2
  const xE = (180 - xA) / 2
  const xB = xA * x
  const xD = 180 - xB - xE

  const y = Trig.sin(xE) * RADIUS / Trig.sin(xD)

  return [y, RADIUS - y]
}

type ElevationPoints = [number, number][]
type ElevationData = {
  points: ElevationPoints,
  highest: number,
  lowest: number,
  distanceFromApi: number
}

export async function getElevationLine(pos1: LatLng, pos2: LatLng): Promise<ElevationData> {
  try {
    let response = await fetch(`https://api.elevationapi.com/api/Elevation/line/${pos1}/${pos2}?dataSet=NASADEM`)
    let data = await response.json()

    if (!data || !data.metrics) {
      return null
    }

    let parsedData = []
    let lowest = 0
    let highest = 0

    for (let i in data.geoPoints) {
      let point = data.geoPoints[i]

      parsedData.push([point.distanceFromOriginMeters / data.metrics.distance, point.elevation])

      if (point.elevation > highest) {
        highest = point.elevation
      }
      if (point.elevation < lowest) {
        lowest = point.elevation
      }
    }

    return {
      points: parsedData as any,
      highest,
      lowest,
      distanceFromApi: data.metrics.distance
    }
  } catch {
    return null
  }
}

export function getElevationAt(points: ElevationPoints, x: number): number {
  if (!points) return 0

  const i1 = points.findIndex(point => point[0] >= x)
  const [x1, y1] = points[i1]

  if (x === 0) return y1

  const [x2, y2] = points[i1 - 1] || points[i1]
  const k = (y2 - y1) / (x2 - x1)
  const y = k * (x - x1) + y1

  return isNaN(y) ? y1 : y
}

export function getElevationOnPolygonAt(curvedDistance: number, points: ElevationPoints, x: number): number {
  let earthCurvature = getCurvatureAt(curvedDistance, x)[1]
  let elevationAt = getElevationAt(points, x)

  return earthCurvature + elevationAt
}
