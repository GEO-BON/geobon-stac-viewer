/* eslint-disable dot-notation */
import React, { useState, useEffect, useReducer, useMemo } from "react";
import { MapContainer, ScaleControl, ZoomControl } from "react-leaflet";
import CustomLayer from "../CustomLayer";
import { useSelector, useDispatch } from "react-redux";
import { MapWrapperContainer } from "../custommapstyles";
import L from "leaflet";

/**
 *
 * @param props properties
 * @returns component
 */
function MapWrapper(props: any) {
  const { selectedLayerTiles } = props;
  //const generalState = useSelector((state: any) => state.reducerState);
  //const drawerOpen = useSelector((state: any) => state.reducerState.drawerOpen);
  const [mapWidth, setMapWidth] = useState("100vw");
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
            style={{
              width: mapWidth,
            }}
          />
          <ZoomControl position="topright" />
          <ScaleControl position="bottomright" />
        </MapContainer>
      </MapWrapperContainer>
    </>
  );
}

export default MapWrapper;
