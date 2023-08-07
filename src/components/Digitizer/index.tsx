import { useEffect, useRef, useState } from "react";
import * as L from "leaflet";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import type { FeatureCollection } from "geojson";
import ReactDOMServer from "react-dom/server";
import BarChartIcon from "@mui/icons-material/BarChart";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

interface Props {
  geojson: FeatureCollection;
  setGeojson: (geojson: FeatureCollection) => void;
  setShowStatsButton: (showStatsButton: boolean) => void;
}

export default function Digitizer({
  geojson,
  setGeojson,
  setShowStatsButton,
}: Props) {
  const ref = useRef<L.FeatureGroup>(null);

  useEffect(() => {
    if (geojson) {
      ref.current?.clearLayers();
      L.geoJSON(geojson).eachLayer((layer) => {
        if (
          (layer instanceof L.Polyline ||
            layer instanceof L.Polygon ||
            layer instanceof L.Marker) &&
          layer?.feature
        ) {
          if (layer?.feature?.properties.radius && ref.current) {
            new L.Circle(layer.feature.geometry.coordinates.slice().reverse(), {
              radius: layer.feature?.properties.radius,
            }).addTo(ref.current);
          } else {
            if (layer?.options && ref.current) {
              layer.options = {
                ...layer.options,
                color: "#038c7c",
                fillColor: "#038c7c",
              };
              layer.addEventListener("popupopen", attachPopupEvents);
            }
            layer.bindPopup(
              ReactDOMServer.renderToString(
                <>
                  {layer?.feature?.properties.place}
                  <div id="layer-delete">
                    <input
                      type="hidden"
                      className="layer-place"
                      value={layer?.feature?.properties.place}
                    ></input>
                    <DeleteForeverIcon />
                  </div>
                </>
              )
            );
            ref.current?.addLayer(layer);
          }
        }
      });
    }
  }, [geojson]);

  const handleChange = () => {
    setShowStatsButton(true);
    const geo = ref.current?.toGeoJSON();
    if (geo?.type === "FeatureCollection") {
      let i = 1;
      geo.features.forEach((f: any) => {
        if (!f.properties.place) {
          f.properties.place = "Area_" + i;
          i = i + 1;
        }
        if (f.properties.place.startsWith("Area_")) {
          i = i + 1;
        }
      });
      setGeojson(geo);
    }
  };

  const handleDelete = (l: any) => {
    const geo = ref.current?.toGeoJSON();
    if (geo?.type === "FeatureCollection") {
      const g = geo.features?.filter((f: any) => f.properties.place !== l);
      geo.features = g;
      setGeojson(geo);
    }
  };

  const attachPopupEvents = () => {
    const buttonEl = document.getElementById("layer-delete");
    if (buttonEl && buttonEl.children.length > 0) {
      buttonEl.addEventListener("click", () => {
        const place = (buttonEl.children[0] as HTMLInputElement).value;
        handleDelete(place);
      });
    }
  };

  const layerOptions = {
    shapeOptions: {
      color: "#038c7c",
    },
  };
  return (
    <FeatureGroup ref={ref}>
      <EditControl
        position="topright"
        onEdited={handleChange}
        onCreated={handleChange}
        onDeleted={handleDelete}
        draw={{
          rectangle: layerOptions,
          circle: false,
          polyline: false,
          polygon: layerOptions,
          marker: false,
          circlemarker: false,
        }}
      />
    </FeatureGroup>
  );
}
