import * as React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@fluentui/react-components";
import { ArrowLeft12Filled } from "@fluentui/react-icons";

const useStyles = makeStyles({
  welcome__header: {
    paddingLeft: "10px",
  },
  back_button: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  },
  back_button_icon: {
    backgroundColor: "#7F7F7F1A",
    borderRadius: "6px",
    width: "39px",
    height: "39px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#004B20",
  },
  back_button_text: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#000000",
  },
  header_container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "10px",
    paddingRight: "15px",
    textAlign: "left",
  },
  title: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#000000",
    paddingTop: "10px",
    fontFamily: "'Poppins', sans-serif",
    margin: 0,
  },
  message: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#000000",
    paddingTop: "10px",
    fontFamily: "'Poppins', sans-serif",
    margin: 0,
  },
});

const AffixHeader = () => {
  const history = useHistory();

  const styles = useStyles();

  return (
    <section className={styles.welcome__header}>
      <div onClick={() => history.goBack()} className={styles.back_button}>
        <div className={styles.back_button_icon}>
          <ArrowLeft12Filled />
        </div>
        <p className={styles.back_button_text}>Back</p>
      </div>
      <div className={styles.header_container}>
        <p className={styles.title}>Affix Stamp</p>
        <p className={styles.message}>Please click on each button below and follow the steps to affix your stamp</p>
      </div>
    </section>
  );
};

export default AffixHeader;
