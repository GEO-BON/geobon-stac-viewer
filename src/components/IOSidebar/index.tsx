import React, { useContext, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { Selector } from "bq-react-lib";
import {
  Title,
  Item,
  SelectorTitle,
  MainTitle,
  MainSubTitle,
} from "src/components/Sidebar/SidebarForms/sidebarformstyles";
import _ from "underscore";
import { GetStac } from "../helpers/api";

function IOSidebar(props: any) {
  const {
    t = (text: string) => text,
    setCurrentLayer,
    currentLayer,
    setCurrentLayerURL,
    setCurrentLayerAssetName,
  } = props;
  const [collectionList, setCollectionList] = useState([]);
  const [collection, setCollection] = useState("");
  const [layerList, setLayerList] = useState([]);

  const handleCollectionChange = (e: any) => {
    setCollection(e.value);
    GetStac(`/collections/${e.value}/items`, { limit: 100 }).then(
      (res: any) => {
        const items: any = res.data.features.map((c: any) => ({
          option: c.properties.description,
          value: c.id,
        }));
        setLayerList(items);
      }
    );
  };

  const handleLayerChange = (e: any) => {
    GetStac(`/collections/${collection}/items/${e.value}`, {}).then(
      (res: any) => {
        setCurrentLayerURL(res.data.links[3].href);
        setCurrentLayerAssetName(Object.keys(res.data.assets)[0]);
        setCurrentLayer(e.value);
      }
    );
  };

  useEffect(() => {
    GetStac("/collections", {}).then((res: any) => {
      const items: any = res.data.collections.map((c: any) => ({
        option: c.title,
        value: c.id,
      }));
      setCollectionList(items);
    });
  }, []);

  return (
    <Grid sx={{ width: "300px", marginLeft: "15px" }}>
      <Title>
        <MainTitle>{t("IO")}</MainTitle>
        <MainSubTitle>
          {"Explore layers available in the Bon-in-a-Box STAC catalog"}
        </MainSubTitle>
      </Title>
      <Stack spacing={{ xs: 1, sm: 2, md: 2 }} sx={{ width: "100%" }}>
        <Item>
          <SelectorTitle>Collection</SelectorTitle>
          <Selector
            selectorList={collectionList}
            selectorId="layer-collection"
            value={collection}
            onValueChange={handleCollectionChange}
            t={t}
          />
        </Item>

        <Item>
          <SelectorTitle>{`Layer`}</SelectorTitle>
          <Selector
            selectorList={layerList}
            value={currentLayer}
            selectorId="layer"
            onValueChange={handleLayerChange}
            t={t}
          />
        </Item>
      </Stack>
      <Box
        sx={{
          width: "50%",
        }}
      />
    </Grid>
  );
}

export default IOSidebar;
