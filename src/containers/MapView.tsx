import "leaflet/dist/leaflet.css"

import { ReactChild, ReactChildren, ReactNodeArray, Ref, useContext, useEffect, useRef, useState } from "react"

import { MapConsumer, MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet"
import * as L from "leaflet"
import { toLatLng } from "../helpers/math/earth"

interface IMapPtPConnectionProps {
  pos1: [number, number],
  pos2: [number, number],

  disableMove?: [boolean, boolean],

  color: string,

  onClick?(pos: [number, number], marker: 1 | 2 | -1): any
  onRightClick?(pos: [number, number], marker: 1 | 2 | -1): any
  onDrag?(pos: [number, number], marker: 1 | 2): any
  onMove?(pos1: [number, number], pos2: [number, number]): any
}

interface IMapViewProps {
  pos: [number, number],

  onClick?(pos: [number, number]): any,
  onRightClick?(pos: [number, number]): any,

  children?: ReactChild | ReactChild[]
}

export function MapPtPConnection(props: IMapPtPConnectionProps) {
  const [pos1, setPos1] = useState(props.pos1)
  const [pos2, setPos2] = useState(props.pos2)

  const marker1 = useRef<L.Marker>()
  const marker2 = useRef<L.Marker>()

  function getClickHandlers(marker: 1 | 2 | -1): L.LeafletEventHandlerFnMap {
    return {
      contextmenu(e: any) {
        e.originalEvent.preventDefault()
      },
      click(e: any) {
        if (props.onClick) {
          if (marker === 1) props.onClick(pos1, 1)
          if (marker === 2) props.onClick(pos2, 2)
          if (marker === -1) props.onClick(toLatLng(e.latLng), -1)
        }
      },
      mouseup(e: any) {
        if (props.onRightClick) {
          if (e.originalEvent.button !== 2) return
          if (props.onRightClick) {
            if (marker === 1) props.onRightClick(pos1, 1)
            if (marker === 2) props.onRightClick(pos2, 2)
            if (marker === -1) props.onRightClick(toLatLng(e.latLng), -1)
          }
        }
      }
    }
  }

  function getListeners(setPos: typeof setPos1, ref: typeof marker1, id: 1 | 2): L.LeafletEventHandlerFnMap {
    return {
      drag() {
        if (props.disableMove && props.disableMove[id - 1]) return

        const pos = toLatLng(ref.current.getLatLng())
        setPos(pos)

        if (props.onDrag) props.onDrag(pos, id)
      },
      dragend() {
        if (props.disableMove && props.disableMove[id - 1]) return

        if (props.onMove) props.onMove(pos1, pos2)
      }
    }
  }

  return (
    <>
      <Polyline positions={[pos1, pos2]} color={props.color} eventHandlers={getClickHandlers(-1)} />
      <Marker
        draggable={props.disableMove ? !(props.disableMove[0]) : true}
        eventHandlers={{ ...getListeners(setPos1, marker1, 1), ...getClickHandlers(1) }}
        position={pos1}
        ref={marker1}>
      </Marker>
      <Marker
        draggable={props.disableMove ? !(props.disableMove[1]) : true}
        eventHandlers={{ ...getListeners(setPos2, marker2, 2), ...getClickHandlers(2) }}
        position={pos2}
        ref={marker2}>
      </Marker></>
  )
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
      <TileLayer
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      />
      {props.children}
    </MapContainer>
  )
}
