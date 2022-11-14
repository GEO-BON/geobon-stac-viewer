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
  const [currentLayer, setCurrentLayer] = useState("");
  const [currentLayerAssetName, setCurrentLayerAssetName] = useState("");
  const [currentLayerURL, setCurrentLayerURL] = useState("");
  const [currentLayerTiles, setCurrentLayerTiles] = useState("");
  const ref = useRef();

  const IOHeaderProps = {
    setCurrentLayer,
  };

  const IOSideBarProps = {
    setCurrentLayer,
  };

  const sidebarProps = {
    currentLayer,
    setCurrentLayer,
    setCurrentLayerURL,
    setCurrentLayerAssetName,
  };

  const leftContentProps = {
    sidebarContent: <IOSidebar {...sidebarProps} />,
  };

  useEffect(() => {
    if (currentLayer !== "" && typeof currentLayer !== "undefined") {
      GetCOGStats(currentLayerURL).then((l: any) => {
        const tiler = `https://tiler.biodiversite-quebec.ca/cog/tiles/{z}/{x}/{y}`;
        let data = [];
        if (Object.keys(l).includes("data")) {
          data = l.data[1];
        } else {
          data = l["currentLayerAssetName"][1];
        }

        const obj = {
          assets: currentLayerAssetName,
          colormap_name: "inferno",
        };
        const rescale = `${data.percentile_2},${data.percentile_98}`;
        const params = new URLSearchParams(obj).toString();
        setCurrentLayerTiles(
          `${tiler}?url=${currentLayerURL}&rescale=${rescale}&${params}`
        );
      });
    }
  }, [currentLayer]);

  const rightContentProps = {
    currentLayerTiles: currentLayerTiles,
  };

  return (
    <AppContainer id="appcontainer">
      <RightContentGroup {...rightContentProps} />
      <LeftContentGroup {...leftContentProps} />
      <GlobalStyle />
    </AppContainer>
  );
}
