/* eslint-disable dot-notation */
import React, { useState, useEffect } from "react";
import { MapContainer, ScaleControl, ZoomControl } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import { Button, Autocomplete, TextField } from "@mui/material";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import BarChartIcon from "@mui/icons-material/BarChart";
import InsightsIcon from "@mui/icons-material/Insights";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import MSMapSlider from "../MSMapSlider";
import CustomLayer from "../CustomLayer";
import { useSelector, useDispatch } from "react-redux";
import { MapWrapperContainer } from "../custommapstyles";
import L from "leaflet";
import { useParams } from "react-router-dom";
import Digitizer from "../../Digitizer";
import type { FeatureCollection } from "geojson";
import StatsModal from "../../StatsModal";
import {
  GetCOGStatsGeojson,
  GetCountryList,
  GetCountryStats,
  GetCountryGeojson,
  GetMultipleCOGStatsGeojson,
} from "../../helpers/api";

/**
 *
 * @param props properties
 * @returns component
 */
function MapWrapper(props: any) {
  //const generalState = useSelector((state: any) => state.reducerState);
  //const drawerOpen = useSelector((state: any) => state.reducerState.drawerOpen);
  const { selectedLayerURL, isTimeSeriesCollection, timeSeriesLayers } = props;
  const [mapWidth, setMapWidth] = useState("100vw");
  const [opacity, setOpacity] = useState("80");
  const [openStatsModal, setOpenStatsModal] = useState(false);
  const [showStatsButton, setShowStatsButton] = useState(false);
  const [activeSearch, setActiveSearch] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = React.useState("");

  const emptyFC: FeatureCollection = {
    type: "FeatureCollection",
    features: [],
  };

  const [geojson, setGeojson] = useState<FeatureCollection>(emptyFC);
  const [rasterStats, setRasterStats] = useState({});
  const [timeSeriesStats, setTimeSeriesStats] = useState({});

  const handleCountryChange = (value: any, reason: any) => {
    if (reason === "clear") {
      setActiveSearch(false);
    }
    if (value) {
      setShowStatsButton(true);
    }
    setSelectedCountry(value);
    GetCountryGeojson(value).then((g: any) => {
      if (g.data) {
        const gj = { ...geojson };
        g.data.features.forEach((f: any) => {
          f.properties.place = value;
        });
        gj.features.push(g.data.features[0]);
        setGeojson(gj);
      }
    });
  };

  const generateStats = () => {
    setRasterStats({});
    setTimeSeriesStats({});
    setOpenStatsModal(true);
    if (geojson?.features.length > 0) {
      let i = 0;
      GetCOGStatsGeojson(selectedLayerURL, geojson).then((g: any) => {
        const rs: any = {};
        if (g.data) {
          g.data.features.map((m: any) => {
            if (m.properties.place === "Area") {
              m.properties.place = `Area_${i}`;
              i += 1;
            }
            rs[m.properties.place] = m.properties.statistics;
          });
          setRasterStats(rs);
        }
      });
    }
    if (selectedCountry && selectedLayerURL) {
      setOpenStatsModal(true);
      setShowStatsButton(true);
    }
  };

  const generateTimeSeries = () => {
    setRasterStats({});
    setTimeSeriesStats({});
    setOpenStatsModal(true);
    if (geojson?.features.length > 0) {
      GetMultipleCOGStatsGeojson(geojson, timeSeriesLayers).then((st: any) => {
        if (st?.data) {
          setTimeSeriesStats(st.data);
        }
      });
    }
    if (selectedCountry && selectedLayerURL) {
      setOpenStatsModal(true);
      setShowStatsButton(true);
    }
  };

  useEffect(() => {
    GetCountryList().then((cl) => {
      setCountryList(cl.data);
    });
  }, []);

  useEffect(() => {
    if (geojson.features.length > 0) {
      setShowStatsButton(true);
    }
  }, [geojson]);

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
              <BarChartIcon />
            </Button>
            <Button
              sx={{
                background: "white",
                padding: "3px 0px 3px 0px",
                width: "auto",
                minWidth: "35px",
                border: "2px solid #00000077",
                display: `${
                  showStatsButton && isTimeSeriesCollection ? "" : "none"
                }`, //Can't remove component since it crashes when there are no features
              }}
              onClick={generateTimeSeries}
            >
              <InsightsIcon />
            </Button>
          </Control>
          <Control position="topright">
            {activeSearch && (
              <Autocomplete
                id="combo-box-demo"
                autoComplete
                includeInputInList
                options={countryList}
                sx={{ width: 200 }}
                onChange={(event: any, newValue: any, reason: any) => {
                  handleCountryChange(newValue, reason);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Country"
                    sx={{ backgroundColor: "white" }}
                  />
                )}
              />
            )}
            {!activeSearch && (
              <Button
                sx={{
                  background: "white",
                  padding: "3px 0px 3px 0px",
                  width: "auto",
                  minWidth: "35px",
                  border: "2px solid #00000077",
                }}
                onClick={() => {
                  setActiveSearch(true);
                }}
              >
                <TravelExploreIcon />
              </Button>
            )}
          </Control>
        </MapContainer>
        <StatsModal
          rasterStats={rasterStats}
          timeSeriesStats={timeSeriesStats}
          setOpenStatsModal={setOpenStatsModal}
          openStatsModal={openStatsModal}
          selectedCountry={selectedCountry}
        />
      </MapWrapperContainer>
    </>
  );
}

export default MapWrapper;
