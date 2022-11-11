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
    <Provider store={store}>
      <TranslateWrapper i18n={i18n}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </TranslateWrapper>
    </Provider>
  </React.StrictMode>
);
