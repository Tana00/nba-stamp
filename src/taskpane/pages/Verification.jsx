import * as React from "react";
import Header from "../components/Header";
import { makeStyles } from "@fluentui/react-components";

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

const VerificationPage = () => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Header logo="assets/logo-filled2.png" message="NIGERIA BAR ASSOCIATION (NBA)" />
    </div>
  );
};

export default VerificationPage;
