import * as React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@fluentui/react-components";
import Header from "../Header";

const useStyles = makeStyles({
  "@global": {
    "&body": {
      fontFamily: "'Inter', sans-serif",
    },
  },
  root: {
    fontFamily: "'Inter', sans-serif",
    overflowY: "auto",
    overflowX: "hidden",
  },
  box: {
    margin: "20px auto",
  },
  container: {
    width: "100%",
    maxWidth: "427px",
    height: "396px",
    borderRadius: "10.22px",
    margin: "auto",
    backgroundColor: "#2E6A36",
    padding: "6px 0",
  },
  wrapper: {
    height: "-webkit-fill-available",
    borderRadius: "11.89px",
    border: "1.19px solid #0000001A",
    padding: "30px 20px",
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    gap: ".6rem",
  },
});

const AuthLayout = ({ children }) => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Header logo="assets/logo-filled.png" message="NIGERIA BAR ASSOCIATION (NBA)" />
      <section className={styles.box}>
        <div className={styles.container}>
          <div className={styles.wrapper}>{children}</div>
        </div>
      </section>
    </div>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.element,
};

export default AuthLayout;
