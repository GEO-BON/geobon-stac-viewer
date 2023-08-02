import React, { useRef, useEffect, useState } from "react";
import { cmap } from "../helpers/colormaps";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Barchart from "./barchart";
import TimeSeries from "./timeseries";

export default function StatsModal(props: any) {
  const {
    rasterStats,
    openStatsModal,
    setOpenStatsModal,
    selectedCountry,
    timeSeriesStats,
  } = props;
  const handleOpen = () => setOpenStatsModal(true);
  const handleClose = () => setOpenStatsModal(false);
  const [histoData, setHistoData] = useState({});
  const [tsData, setTsData] = useState({});
  const [bounds, setBounds] = useState([0, 100]);

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    minWidth: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    let hd: any = [];
    let minx = 9999999;
    let maxx = -9999999;
    for (const place in rasterStats) {
      if (rasterStats[place] && rasterStats[place].b1) {
        let h = rasterStats[place].b1.histogram;
        if (h) {
          let m = -999999;
          for (let i = 0; i < h[0].length; i++) {
            m = Math.max(m, h[0][i]);
            minx = Math.floor(Math.min(minx, h[1][i]));
            maxx = Math.ceil(Math.max(maxx, h[1][i]));
          }
          for (let i = 0; i < h[0].length; i++) {
            hd.push({ xval: h[1][i], yval: h[0][i] / m, place: place });
          }
        }
      }
    }
    setBounds([minx, maxx]);
    setHistoData(hd);
  }, [rasterStats]);

  useEffect(() => {
    let hd: any = [];
    for (const year in timeSeriesStats) {
      for (let place in timeSeriesStats[year])
        if (timeSeriesStats[year][place] && timeSeriesStats[year][place].b1) {
          let h = timeSeriesStats[year][place].b1;
          if (h) {
            hd.push({
              date: year,
              place: place,
              mean: h.mean,
              percentile_2: h.percentile_2,
              percentile_98: h.percentile_98,
            });
          }
        }
    }
    setTsData(hd);
  }, [timeSeriesStats]);

  return (
    <Modal
      open={openStatsModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {rasterStats && (
          <>
            {rasterStats && (
              <>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Statistics for selected areas
                </Typography>

                <Barchart data={histoData} bounds={bounds} />
              </>
            )}
          </>
        )}
        {timeSeriesStats && (
          <>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Time series for selected areas
            </Typography>
            {rasterStats && (
              <>
                <TimeSeries data={tsData} bounds={bounds} />
              </>
            )}
          </>
        )}
      </Box>
    </Modal>
  );
}
