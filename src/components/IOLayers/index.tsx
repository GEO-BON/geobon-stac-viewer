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

export default function IOLayers(props: any) {
  const { textInCard, cardBGHref, onClick } = props;
  const [selectedLayer, setSelectedLayer] = useState("");
  const [selectedLayerAssetName, setSelectedLayerAssetName] = useState("");
  const [selectedLayerURL, setSelectedLayerURL] = useState("");
  const [selectedLayerTiles, setSelectedLayerTiles] = useState("");
  const ref = useRef();

  const IOHeaderProps = {
    setSelectedLayer,
  };

  const IOSideBarProps = {
    setSelectedLayer,
  };

  const sidebarProps = {
    selectedLayer,
    setSelectedLayer,
    setSelectedLayerURL,
    setSelectedLayerAssetName,
  };

  const leftContentProps = {
    sidebarContent: <IOSidebar {...sidebarProps} />,
  };

  useEffect(() => {
    if (selectedLayerURL !== "" && typeof selectedLayerURL !== "undefined") {
      GetCOGStats(selectedLayerURL).then((l: any) => {
        const tiler = `https://tiler.biodiversite-quebec.ca/cog/tiles/{z}/{x}/{y}`;
        let data = [];
        if (Object.keys(l).includes("data")) {
          data = l.data[1];
        } else {
          data = l[selectedLayerAssetName][1];
        }

        const obj = {
          assets: selectedLayerAssetName,
          colormap_name: "inferno",
        };
        const rescale = `${data.percentile_2},${data.percentile_98}`;
        const params = new URLSearchParams(obj).toString();
        setSelectedLayerTiles(
          `${tiler}?url=${selectedLayerURL}&rescale=${rescale}&${params}`
        );
      });
    }
  }, [selectedLayerURL]);

  const rightContentProps = {
    selectedLayerTiles: selectedLayerTiles,
  };

  return (
    <AppContainer id="appcontainer">
      <RightContentGroup {...rightContentProps} />
      <LeftContentGroup {...leftContentProps} />
      <GlobalStyle />
    </AppContainer>
  );
}
