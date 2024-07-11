import * as React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import SignInPage from "./pages/Signin";
import VerificationPage from "./pages/Verification";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";

/* global document, Office, module, require */

// const title = "NBA Stamp & Seal";

const rootElement = document.getElementById("container");
const root = rootElement ? createRoot(rootElement) : undefined;

/* Render application after Office initializes */
Office.onReady(() => {
  root?.render(
    <FluentProvider theme={webLightTheme}>
      <Router>
        <Routes>
          <Route exact path="/" component={() => <SignInPage />} />
          <Route path="/verification" component={VerificationPage} />
        </Routes>
      </Router>
    </FluentProvider>
  );
});

if (module.hot) {
  module.hot.accept("./pages/Signin", () => {
    const NextApp = require("./pages/Signin").default;
    root?.render(
      <FluentProvider theme={webLightTheme}>
        <Router>
          <Routes>
            <Route exact path="/" component={() => <NextApp />} />
            <Route path="/verification" component={VerificationPage} />
          </Routes>
        </Router>
      </FluentProvider>
    );
  });
}
