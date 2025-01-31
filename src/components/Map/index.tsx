import { useEffect, useState, useRef, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { useLocation } from "react-router-dom";

export default function Map(props: any) {
  const { selectedLayerTiles, opacity } = props;

  const [showPopup, setShowPopup] = useState<boolean>(true);
  const [clickCoor, setClickCoor]: any = useState([0, 0]);
  const [mapp, setMapp]: any = useState(false);
  const [search, setSearch] = useState("");
  const mapRef = useRef();

  useEffect(() => {
    // this is so we share one instance across the JS code and the map renderer
    if (selectedLayerTiles && !mapp) {
      const map = new maplibregl.Map({
        container: "App",
        zoom: 3,
        center: [0, 0],
        style: {
          version: 8,
          projection: {
            type: "globe",
          },
          sources: {
            satellite: {
              url: "https://api.maptiler.com/tiles/satellite-v2/tiles.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL",
              type: "raster",
            },
            cog: {
              type: "raster",
              tiles: [selectedLayerTiles],
              tileSize: 256,
            },
            terrain: {
              type: "raster-dem",
              tiles: [
                "https://tiler.biodiversite-quebec.ca/cog/tiles/{z}/{x}/{y}?url=https://object-arbutus.cloud.computecanada.ca/bq-io/io/earthenv/topography/elevation_1KMmn_GMTEDmn.tif&rescale=0,2013.2877197265625&assets=data&colormap_name=inferno&bidx=1&expression=b1",
              ],
              tileSize: 256,
            },
            background: {
              type: "raster",
              tiles: [
                "https://01.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
              ],
              tileSize: 256,
            },
          },
          terrain: { source: "terrain", exaggeration: 0.05 },
          layers: [
            /*{
            id: "sat",
            type: "raster",
            source: "satellite",
          },*/

            {
              id: "back",
              type: "raster",
              source: "background",
            },
            {
              id: "hillsh",
              type: "hillshade",
              source: "terrain",
              paint: {
                "hillshade-exaggeration": 0.05,
              },
              layout: {
                visibility: "none",
              },
            },
            {
              id: "cog",
              type: "raster",
              source: "cog",
              paint: {
                "raster-opacity": opacity / 100,
              },
            },
          ],
          sky: {
            "atmosphere-blend": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              1,
              5,
              1,
              7,
              0,
            ],
          },
          light: {
            anchor: "viewport",
            position: [1.5, 90, 40],
            intensity: 0.25,
            color: "#222",
          },
        },
      });
      map.addControl(new maplibregl.GlobeControl());
      map.addControl(
        new maplibregl.NavigationControl({
          showZoom: true,
          showCompass: false,
        })
      );
      setMapp(map);
      return () => {
        map.remove();
      };
    }
  }, []);

  useEffect(() => {
    if (mapp && selectedLayerTiles) {
      mapp.getSource("cog").setTiles([selectedLayerTiles]);
      mapp.setPaintProperty("cog", "raster-opacity", opacity / 100);
      mapp.triggerRepaint();
    }
    return () => {};
  }, [selectedLayerTiles, opacity]);

  return (
    <div
      id="App"
      className="App"
      style={{
        width: "100vw",
        height: "100vh",
        zIndex: "0",
        background: "url('/viewer/night-sky.png')",
      }}
    ></div>
  );
}
