import "leaflet/dist/leaflet.css"

import * as SVG from "@svgdotjs/svg.js"
import { useEffect, useRef, useState, forwardRef } from "react"
import { addCurvatureToLowestAndHighest, ElevationData, getElevationOnPolygonAt } from "../helpers/math/earth"

const SVGContainer = forwardRef((props: any, ref) => {
  return (
    <svg
      width="100%"
      height="100%"
      ref={ref as any} />
  )
})

interface IFresnelViewProps {
  elevationData: ElevationData,
  elevationScale: number,

  distance: number,
  
}

export default function FresnelView(props: IFresnelViewProps) {
  let svgRef = useRef<SVGSVGElement>()
  let [svgElement] = useState(() => <SVGContainer ref={svgRef} />)

  const scaledLowestAndHighest = props.elevationData ? addCurvatureToLowestAndHighest(props.elevationData) : null

  function getScaledHeightAt(x: number, heightPerPixel: number) {
    return (getElevationOnPolygonAt(props.elevationData.distance, props.elevationData.points, x) - scaledLowestAndHighest.lowest * 0.9) / heightPerPixel
  }

  function setSvgContent() {
    let { clientWidth, clientHeight } = svgRef.current
    svgRef.current.setAttribute("viewbox", `0 0 ${clientWidth} ${clientHeight}`)

    const svgContext = new SVG.Container(svgRef.current)
    svgContext.clear()

    if (!props.elevationData) return

    const heightPerPixel = props.elevationData.highest / (clientHeight * props.elevationScale)

    const items = []
    items.push([-1, clientHeight + 1])
    items.push([0, clientHeight - getScaledHeightAt(0, heightPerPixel)])

    for (let i = 0; i <= clientWidth + 1; i++) {
      const progress = Math.min(1, i / clientWidth)
      const heightAtPoint = getScaledHeightAt(progress, heightPerPixel)

      items.push([i, clientHeight - heightAtPoint])
    }

    items.push([clientWidth + 1, clientHeight + 1])

    svgContext.polygon(items as any).fill("currentColor")
  }

  useEffect(() => {
    const onResize = () => setSvgContent()

    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [props.elevationData])

  useEffect(() => {
    setSvgContent()
  }, [props.elevationScale, props.elevationData])

  return svgElement
}
