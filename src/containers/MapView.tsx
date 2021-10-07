import "leaflet/dist/leaflet.css"

import { ReactChild } from "react"
import { MapContainer, TileLayer, useMap } from "react-leaflet"

import { toLatLng } from "../helpers/math/earth"

interface IMapViewProps {
  pos: [number, number],
  mapType: "flat" | "satellite",

  onClick?(pos: [number, number]): any,
  onRightClick?(pos: [number, number]): any,

  children?: ReactChild | ReactChild[]
}

function Consume(props: any) {
  const map = useMap()

  map.addEventListener("contextmenu", (e: any) => e.originalEvent.preventDefault())
  map.addEventListener("click", (e: any) => {
    if (props.onClick) props.onClick(toLatLng(e.latLng))
  })
  map.addEventListener("mouseup", (e: any) => {
    if (props.onRightClick) {
      if (e.originalEvent.button !== 2) return
      if (props.onRightClick) props.onRightClick(toLatLng(e.latLng))
    }
  })

  return (<></>)
}

export function MapView(props: IMapViewProps) {
  return (
    <MapContainer center={props.pos} zoom={13} className="h-full w-full" attributionControl={false} zoomControl={false} style={{ cursor: "default" }}>
      <Consume onClick={props.onClick} onRightClick={props.onRightClick} />
      {props.mapType === "flat" ? (
        <TileLayer
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
      ) : <></>}
      {props.mapType === "satellite" ? (
        <TileLayer
          url="https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=4ZwcoksqDfiRwZuvVrn3"
        />
      ) : <></>}
      {props.children}
    </MapContainer>
  )
}
