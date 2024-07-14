import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@fluentui/react-components";
import AuthLayout from "./layout/authLayout";
import Spinner from "./shared/Spinner";

const useStyles = makeStyles({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
  },
  text: {
    color: "#00000080",
    fontSize: "12px",
    fontFamily: "'DM Sans', sans-serif",
    marginTop: "2rem",
  },
});

const Loader = () => {
  const history = useHistory();
  const styles = useStyles();

  const authenticated = true;

  useEffect(() => {
    if (authenticated) history.push("/dashboard");
  }, [authenticated]);

  //   console.log("authenticated", history.);

  return (
    <AuthLayout>
      <div className={styles.wrapper}>
        <Spinner />
        <p className={styles.text}>Analysing...</p>
      </div>
    </AuthLayout>
  );
};

export default Loader;
