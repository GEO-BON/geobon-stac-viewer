import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import IOSidebar from "../IOSidebar";
import CustomMap from "../CustomMap";
import LeftContentGroup from "../LeftContentGroup";
import RightContentGroup from "../RightContentGroup";
import { AppContainer, BottomNavBarContainer, GlobalStyle } from "../../styles";
import { GetCOGStats } from "../helpers/api";
import { cmap } from "../helpers/colormaps";
import { createRangeLegendControl } from "../SimpleLegend";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";

export default function IOLayers(props: any) {
  const { textInCard, cardBGHref, onClick } = props;
  const quantcmaps = ["inferno", "spectral", "terrain", "coolwarm", "hot"];
  const qualcmaps = ["tab10", "tab20", "tab20b"];
  const [collection, setCollection] = useState("chelsa-clim");
  const [item, setItem] = useState("bio1");
  const [selectedLayerAssetName, setSelectedLayerAssetName] = useState("");
  const [logTransform, setLogTransform] = useState(false);
  const [selectedLayerURL, setSelectedLayerURL] = useState("");
  const [selectedLayerTiles, setSelectedLayerTiles] = useState(
    "https://tiler.biodiversite-quebec.ca/cog/tiles/4/5/6?url=https://object-arbutus.cloud.computecanada.ca/bq-io/io/CHELSA/climatologies/CHELSA_bio1_1981-2010_V.2.1.tif&rescale=2265,3004&assets=bio1&colormap_name=inferno&bidx=1&expression=b1"
  );
  const [legend, setLegend] = useState({});
  const [colormap, setColormap] = useState("inferno");
  const [colormapList, setColormapList] = useState(quantcmaps);
  const [isTimeSeriesCollection, setIsTimeSeriesCollection] = useState(false);
  const [timeSeriesLayers, setTimeSeriesLayers] = useState([]);
  const [opacity, setOpacity] = useState(80);

  const navigate = useNavigate();
  const location = useLocation();

  const logIt = (event: any) => {
    event.stopPropagation();
    setLogTransform(event.target.checked);
  };

  const sidebarProps = {
    item,
    collection,
    setSelectedLayerURL,
    setSelectedLayerAssetName,
    setColormap,
    setColormapList,
    qualcmaps,
    quantcmaps,
    colormap,
    logIt,
    setIsTimeSeriesCollection,
    setTimeSeriesLayers,
  };

  const leftContentProps = {
    sidebarContent: (
      <Routes>
        <Route
          path="/viewer/:collection/:item/"
          element={<IOSidebar {...sidebarProps} />}
        ></Route>
        <Route path="/viewer" element={<IOSidebar {...sidebarProps} />}></Route>
      </Routes>
    ),
  };

  useEffect(() => {
    if (selectedLayerURL !== "" && typeof selectedLayerURL !== "undefined") {
      GetCOGStats(selectedLayerURL, logTransform).then((l: any) => {
        const tiler = `https://tiler.biodiversite-quebec.ca/cog/tiles/{z}/{x}/{y}`;
        let data = [];
        if (Object.keys(l).includes("data")) {
          data = l.data[Object.keys(l.data)[0]];
        } else {
          data = l[selectedLayerAssetName][1];
        }
        let expression = "b1";
        if (logTransform) {
          expression = "sqrt(b1)";
          if (selectedLayerURL.includes("gbif_heatmaps")) {
            expression = "log(b1+1)";
          }
        }

        const obj = {
          assets: selectedLayerAssetName,
          colormap_name: colormap,
          bidx: "1",
          expression: expression,
        };
        let min = data.percentile_2;
        let max = data.percentile_98;
        if (min === max) {
          min = data.min;
          max = data.max;
        }
        const rescale = `${min},${max}`;
        const params = new URLSearchParams(obj).toString();
        setSelectedLayerTiles(
          `${tiler}?url=${selectedLayerURL}&rescale=${rescale}&${params}`
        );
        setLegend(createRangeLegendControl(min, max, cmap(colormap)));
      });
    }
  }, [selectedLayerURL, logTransform, colormap]);

  useEffect(() => {
    if (
      location.pathname === "/viewer" ||
      location.pathname === "/viewer/" ||
      location.pathname === "/"
    ) {
      navigate("/viewer/chelsa-clim/bio1");
    }
  }, [location]);

  const rightContentProps = {
    selectedLayerTiles,
    selectedLayerURL,
    legend,
    setColormap,
    setCollection,
    setItem,
    colormap,
    colormapList,
    isTimeSeriesCollection,
    timeSeriesLayers,
    opacity,
    setOpacity,
  };

  return (
    <AppContainer id="appcontainer">
      <RightContentGroup {...rightContentProps} />
      <LeftContentGroup {...leftContentProps} />
      <GlobalStyle />
    </AppContainer>
  );
}
