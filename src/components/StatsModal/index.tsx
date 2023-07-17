import React, { useRef, useEffect, useState } from "react";
import { cmap } from "../helpers/colormaps";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Barchart from "./barchart";

export default function StatsModal(props: any) {
  const { rasterStats, openStatsModal, setOpenStatsModal } = props;
  const handleOpen = () => setOpenStatsModal(true);
  const handleClose = () => setOpenStatsModal(false);
  const [histoData, setHistoData] = useState({});

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
    const h = rasterStats.features[0]?.properties.statistics.b1.histogram;
    if (h) {
      let i;
      for (i = 0; i < h[0].length; i++) {
        hd.push({ xval: h[1][i], yval: h[0][i] });
      }
    }
    setHistoData(hd);
  }, [rasterStats]);

  return (
    <Modal
      open={openStatsModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Statistics for selected area
        </Typography>
        {rasterStats &&
          rasterStats.features &&
          rasterStats.features.length > 0 && (
            <>
              <Barchart data={histoData} />
              <List>
                <ListItem>
                  <strong>Mean</strong>:{" "}
                  {Math.trunc(
                    rasterStats.features[0].properties.statistics.b1.mean * 100
                  ) / 100}
                </ListItem>
                <ListItem>
                  <strong>Min</strong>:{" "}
                  {Math.trunc(
                    rasterStats.features[0].properties.statistics.b1.min * 100
                  ) / 100}
                </ListItem>
                <ListItem>
                  <strong>Max</strong>:{" "}
                  {Math.trunc(
                    rasterStats.features[0].properties.statistics.b1.max * 100
                  ) / 100}
                </ListItem>
              </List>
            </>
          )}
      </Box>
    </Modal>
  );
}
