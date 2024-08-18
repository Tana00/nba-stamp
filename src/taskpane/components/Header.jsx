import * as React from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { Image, makeStyles } from "@fluentui/react-components";
import { ArrowLeft12Filled } from "@fluentui/react-icons";

const useStyles = makeStyles({
  welcome__header: {
    // backgroundColor: tokens.colorNeutralBackground3,
  },
  header_container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: "20px",
    paddingTop: "30px",
  },
  logo: {
    width: "122px",
    height: "124px",
  },
  message: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#000000",
    paddingTop: "10px",
    fontFamily: "'Poppins', sans-serif",
  },
  back_button: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    paddingLeft: "10px",
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
});

const Header = (props) => {
  const history = useHistory();

  const { logo, message } = props;
  const styles = useStyles();

  const isSigninPath = history?.location?.pathname === "/signin";

  return (
    <section className={styles.welcome__header}>
      {!isSigninPath && (
        <div onClick={() => history.goBack()} className={styles.back_button}>
          <div className={styles.back_button_icon}>
            <ArrowLeft12Filled />
          </div>
          <p className={styles.back_button_text}>Back</p>
        </div>
      )}
      <div className={styles.header_container}>
        <Image width="90" height="90" src={logo} alt="logo" className={styles.logo} />
        <h1 className={styles.message}>{message}</h1>
      </div>
    </section>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  logo: PropTypes.string,
  message: PropTypes.string,
};

export default Header;
