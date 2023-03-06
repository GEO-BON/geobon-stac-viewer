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
import { useNavigate, useParams } from "react-router-dom";

function IOSidebar(props: any) {
  const {
    t = (text: string) => text,
    setSelectedLayerURL,
    setSelectedLayerAssetName,
    setColormap,
    setColormapList,
    qualcmaps,
    quantcmaps,
    colormap,
  } = props;
  const [collectionList, setCollectionList] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [selectedLayer, setSelectedLayer] = useState("");
  const [layerList, setLayerList] = useState([]);
  const [showLayers, setShowLayers] = useState(true);
  const [showMonths, setShowMonths] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState("tas");
  const [showYears, setShowYears] = useState(false);
  const [showVariable, setShowVariable] = useState(false);
  const [selectedYear, setSelectedYear] = useState(1980);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const navigate = useNavigate();

  interface Params {
    collection: string;
    item: string;
  }
  const { collection, item } = useParams<keyof Params>() as Params;

  const yearList = Array.from({ length: 40 }, (_, i) => i + 1980).map(
    (v: any) => ({
      option: v,
      value: v,
    })
  );
  const monthList = Array.from({ length: 12 }, (_, i) => i + 1).map(
    (v: any) => ({
      option: v,
      value: v,
    })
  );

  const chelsaVariableList = [
    {
      option: "Mean daily air temperature - tas",
      value: "tas",
    },
    {
      option: "Mean daily minimum air temperature - tasmin",
      value: "tasmin",
    },
    {
      option: "Mean daily maximum 2m air temperature - tasmax",
      value: "tasmax",
    },
    {
      option: "Cloud area fraction - clt",
      value: "clt",
    },
    {
      option: "Climate moisture index - cmi",
      value: "cmi",
    },
    {
      option: "Near-surface relative humidity - hurs",
      value: "hurs",
    },
    {
      option: "Potential evapotranspiration - pet_penman",
      value: "pet_penman",
    },
    {
      option: "Precipitation amount - pr",
      value: "pr",
    },
    {
      option: "Near-surface wind speed - sfcWind",
      value: "sfcWind",
    },
    {
      option: "Vapor pressure deficit",
      value: "vpd",
    },
  ];

  const handleCollectionChange = (e: any) => {
    setSelectedCollection(e.value);
    if (e.value === "chelsa-monthly") {
      setShowYears(true);
      setShowMonths(true);
      setShowVariable(true);
      setShowLayers(false);
      setLayerList([]);
      //Route set the item
      if (e.layerSelected !== "") {
        const str = e.layerSelected.split("_");
        setSelectedVariable(str[0]);
        setSelectedYear(str[2]);
        setSelectedMonth(parseInt(str[1]));
      }
    } else {
      setShowMonths(false);
      setShowYears(false);
      setShowVariable(false);
      setShowLayers(true);
      GetStac(`/collections/${e.value}/items`, { limit: 200 }).then(
        (res: any) => {
          let items: any = "";

          items = res.data.features.map((c: any) => {
            let option = c.properties.description;
            if (c.collection === "esacci-lc") {
              option = c.properties.year;
            } else if (c.collection === "chelsa-clim-proj") {
              option = `${c.properties.variable}-${c.properties.rcp}-${c.properties.model}`;
            } else if (c.collection === "soilgrids") {
              option = `${c.properties.variable}-${c.properties.depth}`;
            }
            return {
              option: option,
              value: c.id,
            };
          });
          setLayerList(items);
          if (e.layerSelected !== undefined && e.layerSelected !== "") {
            //Route set the item
            setSelectedLayer(e.layerSelected);
          }
        }
      );
    }
  };

  const handleLayerChange = (e: any = "") => {
    let val = "";
    if (e !== "") {
      val = e.value;
    } else {
      if (selectedCollection === "chelsa-monthly") {
        let month = "";
        if (selectedMonth < 10) {
          month = `0${selectedMonth}`;
        } else {
          month = selectedMonth.toString();
        }
        val = `${selectedVariable}_${month}_${selectedYear}`;
      } else {
        val = selectedLayer;
      }
    }

    if (val.indexOf("-lc") !== -1) {
      setColormap("tab10");
      setColormapList(qualcmaps);
    } else if (qualcmaps.includes(colormap)) {
      setColormap("inferno");
      setColormapList(quantcmaps);
    }

    GetStac(`/collections/${selectedCollection}/items/${val}`, {}).then(
      (res: any) => {
        setSelectedLayerURL(
          res.data.assets[Object.keys(res.data.assets)[0]].href
        );
        setSelectedLayerAssetName(Object.keys(res.data.assets)[0]);
        navigate(`/apps/io-layers/${selectedCollection}/${val}`);
      }
    );
  };

  const handleYearChange = (e: any) => {
    setSelectedYear(e.value);
  };
  const handleMonthChange = (e: any) => {
    setSelectedMonth(e.value);
  };

  const handleVariableChange = (e: any) => {
    setSelectedVariable(e.value);
  };

  useEffect(() => {
    handleLayerChange("");
  }, [selectedVariable, selectedMonth, selectedYear, selectedLayer]);

  useEffect(() => {
    GetStac("/collections", {}).then((res: any) => {
      const items: any = res.data.collections.map((c: any) => ({
        option: c.title,
        value: c.id,
      }));
      setCollectionList(items);
    });
  }, []);

  useEffect(() => {
    let t: any = {};
    t.value = collection;
    t.layerSelected = item;
    handleCollectionChange(t);
  }, [collection, item]);

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
            value={selectedCollection}
            onValueChange={handleCollectionChange}
            t={t}
          />
        </Item>

        {showYears && (
          <Item>
            <SelectorTitle>{`Year`}</SelectorTitle>
            <Selector
              selectorList={yearList}
              value={selectedYear.toString()}
              selectorId="year"
              onValueChange={handleYearChange}
              t={t}
            />
          </Item>
        )}
        {showMonths && (
          <Item>
            <SelectorTitle>{`Month`}</SelectorTitle>
            <Selector
              selectorList={monthList}
              value={selectedMonth.toString()}
              selectorId="month"
              onValueChange={handleMonthChange}
              t={t}
            />
          </Item>
        )}
        {showVariable && (
          <Item>
            <SelectorTitle>{`Variable`}</SelectorTitle>
            <Selector
              selectorList={chelsaVariableList}
              value={selectedVariable}
              selectorId="variable"
              onValueChange={handleVariableChange}
              t={t}
            />
          </Item>
        )}
        {showLayers && (
          <Item>
            <SelectorTitle>{`Layer`}</SelectorTitle>
            <Selector
              selectorList={layerList}
              value={selectedLayer}
              selectorId="layer"
              onValueChange={handleLayerChange}
              t={t}
            />
          </Item>
        )}
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
