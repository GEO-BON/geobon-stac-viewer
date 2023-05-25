/* eslint-disable dot-notation */
import React, { useState, useEffect, useReducer, useMemo } from "react";
import { MapContainer, ScaleControl, ZoomControl } from "react-leaflet";
import MSMapSlider from "../MSMapSlider";
import CustomLayer from "../CustomLayer";
import { useSelector, useDispatch } from "react-redux";
import { MapWrapperContainer } from "../custommapstyles";
import L from "leaflet";
import { useParams } from "react-router-dom";

/**
 *
 * @param props properties
 * @returns component
 */
function MapWrapper(props: any) {
  //const generalState = useSelector((state: any) => state.reducerState);
  //const drawerOpen = useSelector((state: any) => state.reducerState.drawerOpen);
  const [mapWidth, setMapWidth] = useState("100vw");
  const [opacity, setOpacity] = useState("80");
  /**
   * props for Customlayer component
   */

  return (
    <>
      <MapWrapperContainer>
        <MapContainer
          zoom={5}
          center={[55, -69]}
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
        </MapContainer>
      </MapWrapperContainer>
    </>
  );
}

export default MapWrapper;
