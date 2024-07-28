import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@fluentui/react-components";
// import AuthLayout from "./layout/authLayout";
import Spinner from "./shared/Spinner";
import { useAuthStore } from "../store";

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
    height: "100vh",
  },
  box: {
    margin: "auto",
    display: "flex",
    height: "100%",
  },
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

  const [error, setError] = useState(null);

  const isVerified = useAuthStore((state) => state.isVerified);

  useEffect(() => {
    if (isVerified !== null) {
      if (isVerified) {
        history.push("/dashboard");
      } else {
        setError(isVerified);
      }
    }
  }, [isVerified]);

  if (error) {
    return (
      <div>
        <p>Unable to verify OTP</p>
        <button>Resend OTP</button>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <section className={styles.box}>
        <div className={styles.wrapper}>
          <Spinner />
          <p className={styles.text}>Analysing...</p>
        </div>
      </section>
    </div>
  );

  // return (
  //   <AuthLayout>
  //     <div className={styles.wrapper}>
  //       <Spinner />
  //       <p className={styles.text}>Analysing...</p>
  //     </div>
  //   </AuthLayout>
  // );
};

export default Loader;
