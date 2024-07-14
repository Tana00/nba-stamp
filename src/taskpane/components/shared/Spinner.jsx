import React from "react";
import { makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
  spinnerContainer: {
    backgroundColor: "transparent",
  },
  spinner: {
    position: "relative",
    // backgroundColor: "#003016",
    height: "100px",
    width: "100px",
    borderRadius: "50%",
    background: "conic-gradient(#003016, #00301600)",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    animationDuration: "1s",
    animationName: {
      from: { transform: "rotate(360deg)" },
      to: { transform: "rotate(0deg)" },
    },
    "&:before": {
      content: "''",
      position: "absolute",
      borderRadius: "50%",
      width: "80px",
      height: "80px",
      top: "10px",
      left: "10px",
      backgroundColor: "#fff",
    },
    "&:after": {
      content: "''",
      position: "absolute",
      borderRadius: "50%",
      height: "10px",
      width: "10px",
      backgroundColor: "#003016",
      top: "0",
      left: "45px",
    },
  },
});

const Spinner = () => {
  const styles = useStyles();

  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Spinner;
