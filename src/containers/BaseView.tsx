import { observer } from "mobx-react-lite"
import { useContext, useEffect, useRef, useState } from "react"
import { Context as MainStoreContext } from "../stores/main"

import * as TwColors from "../../tailwind.config.js"

import * as L from "leaflet"
import * as SVG from "@svgdotjs/svg.js"
import Button from "../components/Button"
import { MapView } from "./MapView"
import { MapPtPConnection } from "./MapPtPConnection"
import Attribution from "./Attribution"
import { ElevationData, getDistance, getElevationAt, getElevationLine, getPolygonDistance } from "../helpers/math/earth"
import ElevationView from "./ElevationView"

export default function BaseView() {
  const [mapType, setMapType] = useState("flat")
  const [ptpColor, setPtpColor] = useState(TwColors.theme.colors.green[500])

  const [pos1, setPos1] = useState<L.LatLngTuple>([46, 7.74])
  const [pos2, setPos2] = useState<L.LatLngTuple>([46, 7.8])

  const [elevationData, setElevationData] = useState<ElevationData>()

  function onMove(pos1: L.LatLngTuple, pos2: L.LatLngTuple) {
    setPos1(pos1)
    setPos2(pos2)

    console.log("moved")

    getElevationLine(pos1, pos2).then(setElevationData)
  }

  return (
    <>
      <div className="h-screen relative overflow-hidden z-10">
        <MapView mapType={mapType as any} pos={[46.0, 7.749]}>
          <MapPtPConnection onMove={onMove} color={ptpColor} pos1={pos1} pos2={pos2} />
        </MapView>
      </div>
      <div className="absolute top-0 right-0 z-20 bg-white bg-opacity-75 text-gray-600 text-xs px-1 py-[1px] backdrop-blur">
        <Attribution style={mapType as any} />
      </div>
      <Button
        className="absolute right-0 bottom-1/4 mb-4 rounded-r-none shadow-md z-20"
        onClick={() => mapType === "satellite" ? setMapType("flat") : setMapType("satellite")}
        icon="GlobeOutline"
        theme="full"
      />
      <div className="absolute bottom-0 left-0 w-screen z-20 bg-gray-50 h-1/4 shadow-2xl flex">
        <div className="relative w-1/5 h-"></div>
        <div className="relative w-full h-full border-l border-r border-current text-gray-300">
          <ElevationView data={elevationData} scale={1} />
        </div>
        <div className="relative w-1/5 h-full"></div>
      </div>
    </>
  )
}
