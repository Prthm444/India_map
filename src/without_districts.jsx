import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import * as turf from "@turf/turf"; 


function Map() {
  const CentreOfIndia = [78.9629, 23.5937];
  const [tooltipContent, setTooltipContent] = useState("");
  const [zoomLevel, setZoomLevel] = useState(0.5);
  const [mapCenter, setMapCenter] = useState(CentreOfIndia);
  const [indiaGeoJSON, setIndiaGeoJSON] = useState(null);
  const [zoomedState,setZommedState]=useState(null);
  const [zoomed, setZoomed] = useState(false);


  useEffect(() => {
    fetch("/india_states.geojson")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setIndiaGeoJSON(data);
      })
      .catch((error) => console.error("Error fetching GeoJSON:", error));
  }, []);

  if (!indiaGeoJSON) {
    return <div>Loading map data...</div>;
  }

  const handleStateClick = (geo) => {
    const { ST_NM } = geo.properties;
    
    if (zoomed) {
      setMapCenter(CentreOfIndia);
      setZoomed(false);
      setZoomLevel(0.5);
      setZommedState(null);
      
      return;
    }
    const centroid = turf.centroid(geo);
    const [longitude, latitude] = centroid.geometry.coordinates;

    setMapCenter([longitude, latitude]);
    setZoomLevel(2);
    setZoomed(true);
    setZommedState(ST_NM);
  };

  

  

  return (
    <div>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 1000 * zoomLevel, center: mapCenter }}
        width={400}
        height={400}
        
      >
        <Geographies geography={indiaGeoJSON}>
          
          {({ geographies }) =>
            geographies.map((geo) => {
              const { ST_NM } = geo.properties;
              return(
              <Geography
                className="State "
                key={geo.rsmKey}
                geography={geo}
                onMouseEnter={() => {
                  
                  setTooltipContent(ST_NM);
                }}
                onMouseLeave={() => {
                  setTooltipContent("");
                }}
                onClick={() => handleStateClick(geo)}
                style={{
                  default: {
                    fill: (zoomedState===ST_NM) ? "blueviolet" : "#D6D6DA",
                    outline: "none",
                    stroke : "black",
                    strokeWidth: "0.5px"

                  },
                  hover: {
                    fill:  zoomed? ((zoomedState===ST_NM)? "bluviolet":"#D6D6DA"): "black",
                    outline: "none",
                  },
                  pressed: {
                    
                    outline: "none",
                  },
                  active: {
                    
                    outline: "none",
                  },
                }}
              />)
})
          }
        </Geographies>
      </ComposableMap>
      <Tooltip anchorSelect=".State">{tooltipContent}</Tooltip>
    </div>
  );
}

export default Map;
