import * as React from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";
import SignInPage from "./Signin";
import VerificationPage from "./Verification";
import LoaderPage from "./Loader";
import DashboardPage from "./Dashboard";
import AffixStampPage from "./AffixStamp";

function App() {
  return (
    <Switch>
      <Route exact path="/">
        <SignInPage />
      </Route>
      <Route exact path="/verification">
        <VerificationPage />
      </Route>
      <Route exact path="/loader">
        <LoaderPage />
      </Route>
      <Route exact path="/dashboard">
        <DashboardPage />
      </Route>
      <Route exact path="/affix-stamp">
        <AffixStampPage />
      </Route>
    </Switch>
  );
}

export default App;

App.propTypes = {
  //   title: PropTypes.string,
  isOfficeInitialized: PropTypes.bool,
};
