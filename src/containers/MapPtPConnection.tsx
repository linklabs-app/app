import "leaflet/dist/leaflet.css"

import { useEffect, useRef, useState } from "react"
import { Marker, Polyline } from "react-leaflet"
import * as L from "leaflet"

import { toLatLng } from "../helpers/math/earth"
import { randomString } from "../helpers/randomString"

import * as Tw from "../../tailwind.config.js"

interface IMapPtPConnectionProps {
  pos1: [number, number],
  pos2: [number, number],

  disableMove?: [boolean, boolean],

  color: string,

  blink?: boolean,
  dashed?: boolean,

  onClick?(pos: [number, number], marker: 1 | 2 | -1): any
  onRightClick?(pos: [number, number], marker: 1 | 2 | -1): any
  onDrag?(pos: [number, number], marker: 1 | 2): any
  onMove?(pos1: [number, number], pos2: [number, number]): any
}

export function MapPtPConnection(props: IMapPtPConnectionProps) {
  const marker1 = useRef<L.Marker>()
  const marker2 = useRef<L.Marker>()

  const [pos1, setPos1] = useState(props.pos1)
  const [pos2, setPos2] = useState(props.pos2)

  const [markerIds] = useState<string>(() => randomString(16))

  const [markerStyle, setMarkerStyle] = useState<L.DivIcon>(getStyle)
  const [markerStyleSheet, setMarkerStyleSheet] = useState<string>(getStyleSheet)

  function getStyleSheet() {
    return `.${markerIds} { background-color: ${props.color} } .line-${markerIds} { animation: ${props.blink ? "1s opacity-blink infinite" : "none"} }`
  }

  function getStyle() {
    return new L.DivIcon({
      iconUrl: '',
      iconAnchor: new L.Point(10, 10),
      iconSize: new L.Point(20, 20),
      className: `border-[3px] rounded-full border-white shadow-lg ${markerIds}`
    })
  }

  useEffect(() => {
    setMarkerStyleSheet(getStyleSheet)
    setMarkerStyle(getStyle)
  }, [props.color, props.blink])

  function getClickHandlers(marker: 1 | 2 | -1): L.LeafletEventHandlerFnMap {
    return {
      contextmenu(e: any) {
        e.originalEvent.preventDefault()
      },
      click(e: any) {
        if (props.onClick) {
          if (marker === 1) props.onClick(pos1, 1)
          if (marker === 2) props.onClick(pos2, 2)
          if (marker === -1) props.onClick(toLatLng(e.latlng), -1)
        }
      },
      mouseup(e: any) {
        if (props.onRightClick) {
          if (e.originalEvent.button !== 2) return
          if (props.onRightClick) {
            if (marker === 1) props.onRightClick(pos1, 1)
            if (marker === 2) props.onRightClick(pos2, 2)
            if (marker === -1) props.onRightClick(toLatLng(e.latlng), -1)
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
      <style>{markerStyleSheet}</style>
      <Polyline
        positions={[pos1, pos2]}
        pathOptions={{ color: Tw.theme.colors.white, weight: 6 }}
        eventHandlers={getClickHandlers(-1)}
      />
      <Polyline
        positions={[pos1, pos2]}
        pathOptions={{ color: props.color, weight: 3, lineCap: "square", dashArray: props.dashed ? "10, 10" : "0" }}
        className={`!pointer-events-none line-${markerIds}`}
      />
      <Marker
        draggable={props.disableMove ? !(props.disableMove[0]) : true}
        eventHandlers={{ ...getListeners(setPos1, marker1, 1), ...getClickHandlers(1) }}
        position={pos1}
        icon={markerStyle}
        ref={marker1}>
      </Marker>
      <Marker
        draggable={props.disableMove ? !(props.disableMove[1]) : true}
        eventHandlers={{ ...getListeners(setPos2, marker2, 2), ...getClickHandlers(2) }}
        position={pos2}
        icon={markerStyle}
        ref={marker2}>
      </Marker>
    </>
  )
}
