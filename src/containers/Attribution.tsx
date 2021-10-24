import Anchor from "../components/Anchor"

interface IAttributionProps {
  style: "flat" | "satellite"
}

export default function Attribution(props: IAttributionProps) {
  return (
    <>
      Map powered by <Anchor href="https://leafletjs.com/" children="Leaflet" /> | &copy; <Anchor href="https://www.openstreetmap.org/copyright" children="OpenStreetMap contributors" />,&nbsp;
      {props.style === "flat" ? (<>
        Map style by <Anchor href="https://www.hotosm.org/" children="Humanitarian OpenStreetMap Team" />, hosted by <Anchor href="https://www.openstreetmap.fr/" children="OpenStreetMap France" />.
      </>) : <></>}
      {props.style === "satellite" ? (<>
        Imagery provided by <Anchor href="https://www.maptiler.com/copyright/" children="&copy; MapTiler" />.
      </>) : <></>}
      &nbsp;Elevation data provided by <Anchor href="https://elevationapi.com" children="DEM Net Elevation API" /> using data from <Anchor href="https://lpdaac.usgs.gov/products/nasadem_hgtv001/" children="NASA JPL" />.
    </>
  )
}
