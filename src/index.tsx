import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";
import i18n from "./i18n";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { TranslateWrapper } from "./context/Translation";
import { BrowserRouter as Router } from "react-router-dom";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
const theme = createTheme({
  palette: {
    primary: {
      main: "#212529",
    },
  },
});

root.render(
  <React.StrictMode>
    <Router basename="/">
      <Provider store={store}>
        <TranslateWrapper i18n={i18n}>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </TranslateWrapper>
      </Provider>
    </Router>
  </React.StrictMode>
);
