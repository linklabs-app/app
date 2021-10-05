import { observer } from "mobx-react-lite"
import { useContext, useEffect, useRef, useState } from "react"
import { Context as MainStoreContext } from "../stores/main"

import * as L from "leaflet"
import Button from "../components/Button"
import { MapPtPConnection, MapView } from "./MapView"

export default function BaseView() {
  return (
    <div className="h-screen relative overflow-hidden">
      <MapView pos={[46.0, 7.749]}>
        <MapPtPConnection onClick={console.log} onRightClick={console.log} color="#121213" pos1={[46.0, 7.749]} pos2={[46.0, 7.77]} />
      </MapView>
    </div>
  )
}
