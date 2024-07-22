import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles, Image } from "@fluentui/react-components";

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
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
    backgroundImage: `url('../../assets/bgImage2.png')`,
    backgroundSize: "cover",
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: "30px",
    paddingTop: "10px",
  },
  logo: {
    width: "122px",
    height: "124px",
  },
  title: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#000000",
    paddingTop: "10px",
    fontFamily: "'Poppins', sans-serif",
    textAlign: "center",
  },
});

const SplashScreenPage = () => {
  const history = useHistory();
  const styles = useStyles();

  useEffect(() => {
    const timer = setTimeout(async () => {
      history.push("/signin");
    }, 3000);

    // Clear the timeout if the component unmounts or loading changes
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Image width="90" height="90" src={"assets/logo-filled.png"} alt="logo" className={styles.logo} />
        <h1 className={styles.title}>
          {" "}
          NIGERIA BAR ASSOCIATION <br />
          (NBA){" "}
        </h1>
      </div>
    </div>
  );
};

export default SplashScreenPage;
