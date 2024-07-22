import React, { useEffect, useState } from "react";
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

  const [authenticated, setAuthenticated] = useState(false);

  // const validateOtp = () => {
  //   try {
  //     const payload = {
  //       name,
  //       enrolmentNo,
  //       email,
  //       officeAddress: address,
  //       passcode,
  //       confirmPasscode,
  //     };
  //     setIsLoading(true);
  //     setError(null);
  //     const res = await register(payload);
  //     if (res?.succeeded) {
  //       history.push("/verification");
  //     }
  //     setIsLoading(false);
  //   } catch (err) {
  //     setError("Failed to log in. Please check your credentials.");
  //     setIsLoading(false);
  //   }
  // }

  useEffect(() => {
    if (authenticated) history.push("/dashboard");
  }, [authenticated]);

  useEffect(() => {
    if (!authenticated) {
      const timer = setTimeout(async () => {
        setAuthenticated(true);
      }, 3000);

      // Clear the timeout if the component unmounts or loading changes
      return () => clearTimeout(timer);
    }
  }, []);

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
