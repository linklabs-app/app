import "leaflet/dist/leaflet.css"

import { observer } from "mobx-react-lite"
import { useContext, useEffect, useRef, useState } from "react"
import { Context as MainStoreContext } from "../stores/main"

import { MapConsumer, MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet"
import * as L from "leaflet"
import Button from "../components/Button"
import { getCurvatureAt, getPolygonDistance } from "../helpers/math/earth"
import { calculateFresnelRadiusAt } from "../helpers/math/fresnel"

import * as SVG from "@svgdotjs/svg.js"
import geographic from "geographiclib"
import * as geo from "geolib"

function formatNumber(x: number | string) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'")
}

export default observer(function BaseView() {
  let ctx = useContext(MainStoreContext)

  let [bottomControls, setBottomControls] = useState(true)

  let [pos1, setPos1] = useState<L.LatLngTuple>([46, 7.74])
  let [pos2, setPos2] = useState<L.LatLngTuple>([46, 7.8])

  let pos1Ref = useRef<L.Marker>()
  let pos2Ref = useRef<L.Marker>()

  let CanvasRef = useRef<HTMLCanvasElement>()

  let [elevationData, setElevationData] = useState<[number, number][]>(null)

  let [highest, setHighest] = useState(-Infinity)
  let [lowest, setLowest] = useState(Infinity)

  let SvgElementRef = useRef<SVGSVGElement>()
  let [SvgElement, setSvgElement] = useState(<svg height="100%" className="border-l border-r border-gray-200 w-full text-gray-300" ref={SvgElementRef} onMouseEnter={(ev) => {

  }} onMouseLeave={(ev) => {

  }} onMouseOver={(ev) => {

  }} />)

  function drawFresnel() {
    let w = CanvasRef.current.clientWidth
    let h = CanvasRef.current.clientHeight

    CanvasRef.current.width = w
    CanvasRef.current.height = h

    let ctx = CanvasRef.current.getContext("2d")

    ctx.clearRect(0, 0, w, h)

    let m = geographic.Geodesic.WGS84.Inverse(...pos1, ...pos2).s12 / 1000
    let d = getPolygonDistance(m)

    let hLOS1 = (elevationAt(0) + 40 - lowest + 100) / 1000
    let hLOS2 = (elevationAt(1) + 40 - lowest + 100) / 1000

    let i = 0
    let s = w * 1

    let lw = -1
    let lh = -1

    let scale = 1
    let dh = (d / w * h / scale)

    let wpp = d / w
    let hpp = dh / h

    lw = -1
    lh = -1

    let distance = 1
    let lastLine = 0
    let increment = true

    i = 0
    while (i += 1) {
      let id = d / s * i

      let it = i / s

      let hLOS = hLOS1 * (1 - it) + hLOS2 * it

      let iw = w / d * id
      let ih = h - hLOS / hpp


      let f1 = calculateFresnelRadiusAt(5 * 1000 ** 3, m * 1000, 1, it) / 1000
      let f2 = calculateFresnelRadiusAt(5 * 1000 ** 3, m * 1000, 2, it) / 1000

      let elev = (getCurvatureAt(m, i / s)[1] + elevationAt(i / s))

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

          ctx.fillStyle = "orange"
          ctx.fillRect(iw, ih - f1 / hpp, ld, ld)
          ctx.fillRect(iw, ih + f1 / hpp, ld, ld)

          ctx.fillStyle = "green"
          ctx.fillRect(iw, ih - f2 / hpp, ld, ld)
          ctx.fillRect(iw, ih + f2 / hpp, ld, ld)

          lastLine++
        } else {
          if (lastLine === 0) {
            increment = true
          } else
            lastLine--
        }
        ctx.fillStyle = "maroon"
        ctx.fillRect(iw, ih + ld * 0.5, ld, ld)
      }

      lw = iw
      lh = ih

      if (i === s) break
    }
  }

  function setPolyline() {
    let w = SvgElementRef.current.clientWidth
    let h = SvgElementRef.current.clientHeight

    SvgElementRef.current.setAttribute("viewbox", `0 0 ${w} ${h}`)

    let svg = new SVG.Container(SvgElementRef.current)

    svg.clear()


    let m = geographic.Geodesic.WGS84.Inverse(...pos1, ...pos2).s12 / 1000
    let d = getPolygonDistance(m)

    let s = w * 1

    let scale = 1
    let dh = (d / w * h / scale)

    let wpp = d / w
    let hpp = dh / h

    let items = [[-1, h + 1], [0, h - (getCurvatureAt(m, 0)[1] + (elevationAt(0) - (lowest - 100)) / 1000) / hpp]]

    let i = 0

    while (i += 1) {
      let im = m / s * i
      let id = d / s * i

      let iw = w / d * id

      let ih = h - (getCurvatureAt(m, i / s)[1] + (elevationAt(i / s) - (lowest - 100)) / 1000) / hpp

      items.push([iw, ih])

      if (i >= s) break
    }

    items.push([w + 1, h + 1])

    svg.polygon(items as any).fill("currentColor").stroke({ width: 1, color: "black" })
  }

  useEffect(() => {
    setPolyline()
    drawFresnel()
  }, [])

  function elevationAt(x: number) {
    if (!elevationData) return 0

    const index1 = elevationData.findIndex(point => point[0] >= x)

    const [x1, y1] = elevationData[index1]

    if (x === 0) return y1

    const [x2, y2] = elevationData[index1 - 1] || elevationData[index1]

    let k = (y2 - y1) / (x2 - x1)

    let y = k * (x - x1) + y1

    return isNaN(y) ? y1 : y
  }

  function onDragEnd() {
    fetch(`https://api.elevationapi.com/api/Elevation/line/${pos1}/${pos2}?dataSet=${"NASADEM" || "SRTM_GL3"}`).then(resp => resp.json()).catch(() => setElevationData(null)).then((data) => {
      if (!data || !data.metrics) {
        setElevationData(null)
        drawFresnel()
        return setPolyline()
      }

      let parsedData = []

      for (let i in data.geoPoints) {
        let point = data.geoPoints[i]

        parsedData.push([point.distanceFromOriginMeters / data.metrics.distance, point.elevation])

        if (point.elevation > highest) {
          highest = point.elevation
          setHighest(point.elevation)
        }
        if (point.elevation < lowest) {
          lowest = point.elevation
          setLowest(point.elevation)
        }
      }

      elevationData = parsedData
      setElevationData(parsedData)
      drawFresnel()
      setPolyline()
    })
  }

  return (
    <div className="h-screen relative overflow-hidden">
      <Button className="absolute top-0 left-0 z-20" icon="AdjustmentsOutline" onClick={() => setBottomControls(!bottomControls)}>Toggle</Button>
      <MapContainer center={[46.0, 7.749]} zoom={13} className="h-screen z-10" attributionControl={false} zoomControl={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        <Polyline positions={[pos1, pos2]} color="blue" />
        <Marker
          draggable={true}
          eventHandlers={{
            drag() {
              const marker = pos1Ref.current
              const pos = marker.getLatLng()
              setPos1([pos.lat, pos.lng])
            },
            dragend() {
              onDragEnd()
            }
          }}
          position={pos1}
          ref={pos1Ref}>
        </Marker>
        <Marker
          draggable={true}
          eventHandlers={{
            drag() {
              const marker = pos2Ref.current
              const pos = marker.getLatLng()
              setPos2([pos.lat, pos.lng])
            },
            dragend() {
              onDragEnd()
            }
          }}
          position={pos2}
          ref={pos2Ref}>
        </Marker>
      </MapContainer>
      <div className={`w-screen h-1/3 bg-gray-50 flex flex-row absolute z-20 transition shadow-2xl ${bottomControls ? "bottom-0" : "-bottom-1/3"}`} style={{ transitionProperty: "bottom" }}>
        <div className="h-full relative">
          <div className="w-full h-full absolute top-0 left-0 flex flex-col">
            <div className="h-0.5 mt-6 w-full bg-gray-400 rounded-lg" />
            <span className="text-center mt-[-0.875rem] text-gray-800 font-medium mx-auto px-2 bg-gray-50">{(() => {
              let distance = geographic.Geodesic.WGS84.Inverse(...pos1, ...pos2).s12
              if (distance < 1000) {
                return formatNumber((distance).toFixed(0)) + " m"
              } else {
                return formatNumber((distance / 1000).toFixed(2)) + " km"
              }
            })()}</span>
          </div>
          {SvgElement}
          <canvas className="absolute top-0 left-0 w-full h-full" ref={CanvasRef}></canvas>
        </div>
        <div className="w-full flex flex-col max-w-xs flex-shrink-0">
        </div>
      </div>
    </div >
  )
})
