import { useEffect, useRef, useState } from "react";
import * as L from "leaflet";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import type { FeatureCollection } from "geojson";

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

  const handleChange = () => {
    setShowStatsButton(true);
    const geo = ref.current?.toGeoJSON();
    if (geo?.type === "FeatureCollection") {
      setGeojson(geo);
    }
  };

  const handleDelete = () => {
    setShowStatsButton(false);
    const geo = ref.current?.toGeoJSON();
    if (geo?.type === "FeatureCollection" && geo.features.length > 0) {
      setGeojson(geo);
    }
  };

  return (
    <FeatureGroup ref={ref}>
      <EditControl
        position="topright"
        onEdited={handleChange}
        onCreated={handleChange}
        onDeleted={handleDelete}
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
