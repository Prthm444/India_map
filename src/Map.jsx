import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import * as turf from "@turf/turf";

function Map({setState}) {
  const CentreOfIndia = [78.9629, 23.5937];
  const [tooltipContent, setTooltipContent] = useState("");
  const [zoomLevel, setZoomLevel] = useState(0.5);
  const [mapCenter, setMapCenter] = useState(CentreOfIndia);
  const [indiaGeoJSON, setIndiaGeoJSON] = useState(null);
  const [districtGeoJSON, setDistrictGeoJSON] = useState(null);
  const [zoomedState, setZoomedState] = useState(null);
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

    fetch("/india-districts-727.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setDistrictGeoJSON(data);
      })
      .catch((error) => console.error("Error fetching district GeoJSON:", error));
  }, []);

  if (!indiaGeoJSON || !districtGeoJSON) {
    return <div className="text-center text-lg">Loading map data...</div>;
  }

  const handleStateClick = (geo) => {
    const { ST_NM } = geo.properties;

    if (zoomed && ST_NM==zoomedState) {
      setMapCenter(CentreOfIndia);
      setZoomed(false);
      setZoomLevel(0.5);
      setZoomedState(null);
      setState("India");
      return;
    }

    const centroid = turf.centroid(geo);
    const [longitude, latitude] = centroid.geometry.coordinates;

    setMapCenter([longitude, latitude]);
    setZoomLevel(2);
    setZoomed(true);
    setZoomedState(ST_NM);
    setState(ST_NM);
  };

  const isZoomedState = (ST_NM) => zoomedState === ST_NM;

  return (
    <div className="w-full flex justify-center items-center">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 1000 * zoomLevel, center: mapCenter }}
        width={400}
        height={400}
        className="border border-gray-300 rounded-lg shadow-md"
      >
        <Geographies geography={indiaGeoJSON}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const { ST_NM } = geo.properties;
              return (
                <Geography
                  className="State"
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => setTooltipContent(ST_NM)}
                  onMouseLeave={() => setTooltipContent("")}
                  onClick={() => handleStateClick(geo)}
                  style={{
                    default: {
                      fill: isZoomedState(ST_NM) ? "#475569" : "#D6D6DA",
                      outline: "none",
                      stroke: "black",
                      strokeWidth: "0.5px",
                    },
                    hover: {
                      fill: isZoomedState(ST_NM) ? "#475569" : "black",
                      outline: "none",
                    },
                    pressed: {
                      outline: "none",
                    },
                    active: {
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>

        {zoomed && (
          <Geographies geography={districtGeoJSON}>
            {({ geographies }) =>
              (geographies.map((geo) => {
                const { DISTRICT } = geo.properties;
                return (
                  <Geography
                    
                    key={geo.rsmKey}
                    geography={geo}
                    
                    style={{
                      default: {
                        fill: "none",
                        stroke: "#D6D6DA",
                        strokeWidth: "1px",
                        opacity: 0.5,
                      },
                      hover: {
                        fill: "none",
                        opacity: 0.3,
                        outline: "none",
                      },
                      pressed: {
                        opacity: 0,
                        fill: "none",
                        outline: "none",
                      },
                      active: {
                        outline: "none",
                        
                      },
                    }}
                  />
                );
              }))
            }
          </Geographies>
        )}
      </ComposableMap>
      <Tooltip anchorSelect=".State">{tooltipContent}</Tooltip>
    </div>
  );
}

export default Map;
