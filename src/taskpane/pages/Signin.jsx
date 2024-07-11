import * as React from "react";
import Header from "../components/Header";
import { makeStyles } from "@fluentui/react-components";
import Signin from "../components/SignIn";

const useStyles = makeStyles({
  "@global": {
    body: {
      fontFamily: "'Inter', sans-serif",
    },
  },
  root: {
    // minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
    overflowY: "scroll",
    overflowX: "hidden",
  },
});

const SignInPage = () => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Header logo="assets/logo-filled2.png" message="NIGERIA BAR ASSOCIATION (NBA)" />
      <Signin />
    </div>
  );
};

export default SignInPage;
