import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./pages/App";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { HashRouter } from "react-router-dom";
import { AppContainer } from "react-hot-loader";

/* global Office, module, require */

// const title = "NBA Stamp & Seal";
let isOfficeInitialized = false;

const rootElement = document.getElementById("container");
const root = rootElement ? createRoot(rootElement) : undefined;

const render = () => {
  root.render(
    <HashRouter>
      <App isOfficeInitialized={isOfficeInitialized} />
    </HashRouter>
  );
};

/* Render application after Office initializes */
Office.onReady(() => {
  render(
    <AppContainer>
      <FluentProvider theme={webLightTheme}>
        <App isOfficeInitialized={isOfficeInitialized} />
      </FluentProvider>
    </AppContainer>
  );
});

/* Initial render showing a progress bar */
render(App);

if (module.hot) {
  module.hot.accept("./pages/App", () => {
    const NextApp = require("./pages/App").default;
    render(NextApp);
  });
}
