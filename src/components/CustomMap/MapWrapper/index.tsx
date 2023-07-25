/* eslint-disable dot-notation */
import React, { useState, useEffect } from "react";
import { MapContainer, ScaleControl, ZoomControl } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import { Button } from "@mui/material";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import MSMapSlider from "../MSMapSlider";
import CustomLayer from "../CustomLayer";
import { useSelector, useDispatch } from "react-redux";
import { MapWrapperContainer } from "../custommapstyles";
import L from "leaflet";
import { useParams } from "react-router-dom";
import Digitizer from "../../Digitizer";
import type { FeatureCollection } from "geojson";
import StatsModal from "../../StatsModal";
import { GetCOGStatsGeojson } from "../../helpers/api";

/**
 *
 * @param props properties
 * @returns component
 */
function MapWrapper(props: any) {
  //const generalState = useSelector((state: any) => state.reducerState);
  //const drawerOpen = useSelector((state: any) => state.reducerState.drawerOpen);
  const { selectedLayerURL } = props;
  const [mapWidth, setMapWidth] = useState("100vw");
  const [opacity, setOpacity] = useState("80");
  const [openStatsModal, setOpenStatsModal] = useState(false);
  const [showStatsButton, setShowStatsButton] = useState(false);
  const emptyFC: FeatureCollection = {
    type: "FeatureCollection",
    features: [],
  };
  const [geojson, setGeojson] = useState<FeatureCollection>({
    type: "FeatureCollection",
    features: [],
  });
  const [rasterStats, setRasterStats] = useState<FeatureCollection>(emptyFC);

  const generateStats = () => {
    setRasterStats(emptyFC);
    setOpenStatsModal(true);
    if (geojson.features.length > 0) {
      GetCOGStatsGeojson(selectedLayerURL, geojson).then((g: any) => {
        setRasterStats(g.data);
      });
    }
  };

  /**
   * props for Customlayer component
   */

  return (
    <>
      <MapWrapperContainer>
        <MapContainer
          zoom={3}
          center={[20, 0]}
          zoomControl={false}
          style={{
            width: mapWidth,
            height: "calc(100vh)",
          }}
        >
          <CustomLayer
            {...props}
            opacity={opacity}
            style={{
              width: mapWidth,
            }}
          />
          <MSMapSlider
            absolute={true}
            location={"bottom-left"}
            bottom={40}
            left={10}
            width={200}
            notifyChange={(newValue: any) => setOpacity(newValue)}
            value={opacity}
          />
          <ZoomControl position="topright" />
          <ScaleControl position="bottomright" />
          <Digitizer
            geojson={geojson}
            setGeojson={setGeojson}
            setShowStatsButton={setShowStatsButton}
          />
          <Control position="topright">
            <Button
              sx={{
                background: "white",
                padding: "3px 0px 3px 0px",
                width: "auto",
                minWidth: "35px",
                border: "2px solid #00000077",
                display: `${showStatsButton ? "" : "none"}`, //Can't remove component since it crashes when there are no features
              }}
              onClick={generateStats}
            >
              <QueryStatsIcon />
            </Button>
          </Control>
        </MapContainer>
        <StatsModal
          rasterStats={rasterStats}
          setOpenStatsModal={setOpenStatsModal}
          openStatsModal={openStatsModal}
        />
      </MapWrapperContainer>
    </>
  );
}

export default MapWrapper;
