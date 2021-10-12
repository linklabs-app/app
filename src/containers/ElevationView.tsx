import "leaflet/dist/leaflet.css"

import * as SVG from "@svgdotjs/svg.js"
import { useEffect, useRef, useState, forwardRef } from "react"
import { addCurvatureToLowestAndHighest, ElevationData, getElevationOnPolygonAt } from "../helpers/math/earth"

interface ISVGContainerProps {
  onMouseEnter?(ev: MouseEvent): any,
  onMouseLeave?(ev: MouseEvent): any,
  onMouseOver?(ev: MouseEvent): any,

  onClick?(ev: MouseEvent): any,
  onRightClick?(ev: MouseEvent): any,
}

const SVGContainer = forwardRef((props: ISVGContainerProps, ref) => {
  return (
    <svg
      width="100%"
      height="100%"
      ref={ref as any}
      onMouseEnter={() => {

      }}
      onMouseLeave={() => {

      }}
      onMouseOver={() => {

      }} />
  )
})

interface IElevationViewProps {
  data: ElevationData,
  scale: number
}

export default function ElevationView(props: IElevationViewProps) {
  let svgRef = useRef<SVGSVGElement>()
  let [svgElement] = useState(() => <SVGContainer ref={svgRef} />)

  const scaledLowestAndHighest = props.data ? addCurvatureToLowestAndHighest(props.data) : null

  console.log(scaledLowestAndHighest)

  function getScaledHeightAt(x: number, heightPerPixel: number) {
    return (getElevationOnPolygonAt(props.data.distance, props.data.points, x) - scaledLowestAndHighest.lowest * 0.9) / heightPerPixel
  }

  function setSvgContent() {
    let { clientWidth, clientHeight } = svgRef.current
    svgRef.current.setAttribute("viewbox", `0 0 ${clientWidth} ${clientHeight}`)

    const svgContext = new SVG.Container(svgRef.current)
    svgContext.clear()

    if (!props.data) return

    const heightPerPixel = props.data.highest / (clientHeight * props.scale)

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
    const onResize = () => setSvgContent() // debounce(() => setSvgContent(), 250)

    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [props.data])

  useEffect(() => {
    setSvgContent()
  }, [props.scale, props.data])

  return svgElement
}
