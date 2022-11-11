import React from "react";
import IOLayers from "./components/IOLayers";
import { useNavigate, BrowserRouter } from "react-router-dom";
import "leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css";

function App() {
  return (
      <IOLayers key="IOLayers" />
  );
}

export default App;
