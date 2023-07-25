import { useEffect, useRef, useState } from "react";
import * as L from "leaflet";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import type { FeatureCollection } from "geojson";

interface Props {
  geojson: FeatureCollection;
  setGeojson: (geojson: FeatureCollection) => void;
}

export default function Digitizer({ geojson, setGeojson }: Props) {
  const ref = useRef<L.FeatureGroup>(null);

  useEffect(() => {
    if (ref.current?.getLayers().length === 0 && geojson) {
      L.geoJSON(geojson).eachLayer((layer) => {
        if (
          layer instanceof L.Polyline ||
          layer instanceof L.Polygon ||
          layer instanceof L.Marker
        ) {
          if (layer?.feature?.properties.radius && ref.current) {
            new L.Circle(layer.feature.geometry.coordinates.slice().reverse(), {
              radius: layer.feature?.properties.radius,
            }).addTo(ref.current);
          } else {
            ref.current?.addLayer(layer);
          }
        }
      });
    }
  }, [geojson]);

  const onCreate = () => {
    const geo = ref.current?.toGeoJSON();
    if (geo?.type === "FeatureCollection") {
      setGeojson(geo);
    }
  };

  const onEditStop = () => {
    const geo: any = ref.current?.toGeoJSON();
    setGeojson(geo);
  };

  const onDeleteStop = () => {
    const geo: any = ref.current?.toGeoJSON();
    const g: FeatureCollection = {
      type: "FeatureCollection",
      features: [],
    };
    setGeojson(geo);
  };

  return (
    <FeatureGroup ref={ref}>
      <EditControl
        position="topright"
        onEditStop={onEditStop}
        onCreated={onCreate}
        /*onDeleteStop={onDeleteStop}*/
        draw={{
          rectangle: true,
          circle: false,
          polyline: false,
          polygon: true,
          marker: false,
          circlemarker: false,
        }}
      />
    </FeatureGroup>
  );
}
