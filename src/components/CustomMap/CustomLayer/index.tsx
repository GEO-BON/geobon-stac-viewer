import React, { useState, useEffect, useRef } from "react";
import _ from "underscore";
import { Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import { ColorPicker } from "../../ColormapPicker";

/**
 *
 * @param props
 */
function CustomLayer(props: any) {
  const {
    selectedLayerTiles,
    legend,
    setColormap,
    colormap,
    colormapList,
    opacity,
    bounds,
  } = props;
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
    mapbox: `https://api.mapbox.com/styles/v1/glaroc/cl8eqr05i000416umaxkuc4sp/tiles/256/{z}/{x}/{y}@2x?access_token=${
      import.meta.env.REACT_APP_MAPBOX_TOKEN
    }`,
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
      const layer = L.tileLayer(selectedLayerTiles, {
        attribution: "io",
        opacity: opacity / 100,
      });
      const container = map;
      //layerRef.selected = layer;
      container.addLayer(layer);
      if (Object.keys(legend).length !== 0) {
        legend.addTo(map);
      }
    }

    return () => {
      if (legend && Object.keys(legend).length !== 0) legend.remove();
    };
  }, [selectedLayerTiles, opacity]);

  useEffect(() => {
    const layer = L.tileLayer(basemaps[basemap], {
      attribution: "Planet",
    });
    const container = map;
    container.addLayer(layer);
  }, []);

  /*useEffect(() => {
    map.fitBounds(bounds);
  }, [bounds]);*/

  return (
    <ColorPicker
      setColormap={setColormap}
      colormap={colormap}
      colormapList={colormapList}
    />
  );
}

export default CustomLayer;
