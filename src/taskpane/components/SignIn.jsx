import * as React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@fluentui/react-components";
import AuthLayout from "./layout/authLayout";

const useStyles = makeStyles({
  input_wrapper: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    color: "#000000B2",
    fontSize: "16px",
    fontWeight: 500,
    fontFamily: "'Poppins', sans-serif",
  },
  input: {
    color: "#000000CC",
    border: "0.66px solid #D6D6D6",
    height: "60px",
    borderRadius: "6.61px",
    fontSize: "18px",
    fontFamily: "'Poppins', sans-serif",
    paddingLeft: "15px",
    paddingRight: "10px",
    fontWeight: 500,
    marginTop: "6px",
    marginBottom: "4px",
    "&::placeholder": {
      color: "#00000033",
    },
    // "&:focus-visible": {
    //   outlineColor: "0.66px solid #000000CC",
    // },
  },
  forgot_password: {
    width: "fit-content",
    fontSize: "14px",
    fontWeight: 500,
    color: "#FE4141",
    fontFamily: "'DM Sans', sans-serif",
    marginLeft: "auto",
    display: "flex",
    justifyContent: "end",
    textAlign: "end",
    cursor: "pointer",
    marginTop: 0,
    "&:hover": {
      textDecoration: "underline",
    },
  },
  button_wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: "8px",
    marginTop: ".5rem",
  },
  button: {
    backgroundColor: "#2E6A36",
    borderRadius: "6.61px",
    width: "100%",
    height: "55px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: 500,
    fontFamily: "'Poppins', sans-serif",
    border: 0,
    cursor: "pointer",
  },
  no_account: {
    textAlign: "center",
    color: "#061238",
    fontSize: "14px",
    fontWeight: 500,
    fontFamily: "'Poppins', sans-serif",
    margin: 0,
  },
  sign_up_link: {
    color: "#2E6A36",
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
    },
  },
});

const Signin = () => {
  const history = useHistory();
  const styles = useStyles();

  return (
    <AuthLayout>
      <>
        <div className={styles.input_wrapper}>
          <label htmlFor="enrollmentNumber" className={styles.label}>
            Enter enrolment number
          </label>
          <input id="enrollmentNumber" type="text" className={styles.input} placeholder="SCN******" />
        </div>
        <div className={styles.input_wrapper}>
          <label htmlFor="passcode" className={styles.label}>
            Enter passcode
          </label>
          <input id="passcode" type="password" className={styles.input} placeholder="********" />
          <p className={styles.forgot_password}>Forgot Password?</p>
        </div>
        <div className={styles.button_wrapper}>
          <button onClick={() => history.push("/verification")} className={styles.button}>
            Sign In to your Account
          </button>
          <p className={styles.no_account}>
            Don&apos;t have an account? <span className={styles.sign_up_link}>Sign up</span>
          </p>
        </div>
      </>
    </AuthLayout>
  );
};

export default Signin;
