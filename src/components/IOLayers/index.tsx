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
import { AppContainer, BottomNavBarContainer, GlobalStyle } from "src/styles";
import { GetCOGStats } from "../helpers/api";
import { cmap } from "../helpers/colormaps";
import { createRangeLegendControl } from "../SimpleLegend";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";

export default function IOLayers(props: any) {
  const { textInCard, cardBGHref, onClick } = props;
  const quantcmaps = ["inferno", "spectral", "terrain", "coolwarm"];
  const qualcmaps = ["tab10", "tab20", "tab20b"];
  const [collection, setCollection] = useState("chelsa-clim");
  const [item, setItem] = useState("bio1");
  const [selectedLayerAssetName, setSelectedLayerAssetName] = useState("");
  const [logTransform, setLogTransform] = useState(false);
  const [selectedLayerURL, setSelectedLayerURL] = useState("");
  const [selectedLayerTiles, setSelectedLayerTiles] = useState("");
  const [legend, setLegend] = useState({});
  const [colormap, setColormap] = useState("inferno");
  const [colormapList, setColormapList] = useState(quantcmaps);

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
  };

  const leftContentProps = {
    sidebarContent: (
      <Routes>
        <Route
          path="/apps/io-layers/:collection/:item/"
          element={<IOSidebar {...sidebarProps} />}
        ></Route>
        <Route
          path="/apps/io-layers/"
          element={<IOSidebar {...sidebarProps} />}
        ></Route>
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
    if (location.pathname === "/apps/io-layers") {
      navigate("/apps/io-layers/chelsa-clim/bio1");
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
  };

  return (
    <AppContainer id="appcontainer">
      <LeftContentGroup {...leftContentProps} />
      <RightContentGroup {...rightContentProps} />
      <GlobalStyle />
    </AppContainer>
  );
}
