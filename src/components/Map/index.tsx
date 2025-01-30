import { useEffect, useState, useRef, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useLocation } from "react-router-dom";

export default function Map(props: any) {
  const { selectedLayerTiles } = props;

  const [showPopup, setShowPopup] = useState<boolean>(true);
  const [clickCoor, setClickCoor]: any = useState([0, 0]);
  const [mapp, setMapp]: any = useState(false);
  const [search, setSearch] = useState("");
  const mapRef = useRef();

  const [opacity, setOpacity]: any = useState(1);

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
            background: {
              type: "raster",
              tiles: [
                "https://01.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
              ],
              tileSize: 256,
            },
          },
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
              id: "cog",
              type: "raster",
              source: "cog",
              paint: {
                "raster-opacity": 0.7,
              },
            },
          ],
          /*sky: {
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
          position: [1.5, 90, 50],
          intensity: 0.05,
        },*/
        },
      });
      map.addControl(new maplibregl.GlobeControl());
      setMapp(map);
      return () => {
        map.remove();
      };
    }
  }, []);

  useEffect(() => {
    if (mapp && selectedLayerTiles) {
      mapp.getSource("cog").setTiles([selectedLayerTiles]);
      /*mapp.removeSource("cog");
      mapp.removeLayer("cog");
      mapp.addSource("cog", {
        type: "raster",
        tiles: [selectedLayerTiles],
        tileSize: 256,
      });
      mapp.addLayer({
        id: "cog",
        type: "raster",
        source: "cog",
        paint: {
          "raster-opacity": 0.7,
        },
      });
      /*map.style.sourceCaches["cog"].clearTiles();
      map.style.sourceCaches["cog"].update(map.transform);*/
      mapp.triggerRepaint();
    }
    return () => {};
  }, [selectedLayerTiles]);

  return (
    <div
      id="App"
      className="App"
      style={{ width: "100vw", height: "100vh", zIndex: "0" }}
    ></div>
  );
}
