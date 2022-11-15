import React, { useState, useEffect, useRef } from "react";
import _ from "underscore";
import { Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";

/**
 *
 * @param props
 */
function CustomLayer(props: any) {
  const { selectedLayerTiles } = props;
  const [tiles, setTiles] = useState(<></>);
  const [basemap, setBasemap] = useState("carto");
  const map = useMap();
  const layerContainer = map.getContainer();
  const layerRef = useRef(null);

  const basemaps: any = {
    osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    carto:
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
    cartoDark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    thunderforest:
      "https://{s}.tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}.png",
    mapbox: `https://api.mapbox.com/styles/v1/glaroc/cl8eqr05i000416umaxkuc4sp/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`,
  };

  useEffect(() => {
    if (
      selectedLayerTiles !== "" &&
      typeof selectedLayerTiles !== "undefined"
    ) {
      map.eachLayer(function (layer: any) {
        if (layer.options.attribution === "io") {
          map.removeLayer(layer);
        }
      });
      let layerId = Math.random();
      const layer = L.tileLayer(selectedLayerTiles, {
        attribution: "io",
      });
      const container = map;
      //layerRef.selected = layer;
      container.addLayer(layer);
    }
  }, [selectedLayerTiles]);

  useEffect(() => {
    const layer = L.tileLayer(basemaps[basemap], {
      attribution: "Planet",
    });
    const container = map;
    container.addLayer(layer);
  }, []);

  /**
   * props for Customlayer component
   */

  return <></>;
}

export default CustomLayer;
