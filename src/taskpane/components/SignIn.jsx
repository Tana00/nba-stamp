import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@fluentui/react-components";
import AuthLayout from "./layout/authLayout";
import { login } from "../api";

const useStyles = makeStyles({
  container: {
    position: "relative",
  },
  input_wrapper: {
    display: "flex",
    flexDirection: "column",
    marginTop: ".8rem",
    ":first-of-type": {
      marginTop: "0",
    },
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
    marginTop: "1.4rem",
  },
  button: {
    backgroundColor: "#2E6A36",
    borderRadius: "6.61px",
    width: "100%",
    height: "55px",
    border: 0,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& span": {
      color: "#ffffff",
      fontSize: "16px",
      fontWeight: 500,
      fontFamily: "'Poppins', sans-serif",
    },
    ":focus-visible": {
      outline: "none",
    },
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
  error: {
    fontSize: "11px",
    margin: 0,
    color: "red",
    position: "absolute",
    top: "-1rem",
  },
  loader: {
    marginLeft: "8px",
    border: "3px solid #e5e7eb",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    borderTopColor: "#2E6A36",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    animationDuration: "1s",
    animationName: {
      from: { transform: "rotate(360deg)" },
      to: { transform: "rotate(0deg)" },
    },
  },
  content: {
    borderRadius: "10px",
    backgroundColor: "#fff",
    padding: "15px 25px",
    width: "400px",
    "& .close_icon": {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      textAlign: "end",
      marginLeft: "auto",
      cursor: "pointer",
      position: "absolute",
      right: "20px",
    },
    "& .header": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 10px auto",
    },
    "& .title": {
      fontSize: "18px",
      fontWeight: 600,
      color: "#000000CC",
      fontFamily: "'Poppins', sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "20px auto 10px auto",
    },
    "& .input_wrapper": {
      margin: "2rem 0",
    },
    "& button": {
      fontSize: "14px",
      fontWeight: 600,
      fontFamily: "'Poppins', sans-serif",
      height: "50px",
      width: "100%",
      borderRadius: "10px",
      backgroundColor: "#2E6A36",
      color: "#fff",
      border: 0,
      margin: "1.2rem 0",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ":disabled": {
        backgroundColor: "#F1F1F1",
        color: "#AFAFAF",
      },
      ":focus-visible": {
        outline: "none",
      },
    },
  },
});

const Signin = () => {
  const history = useHistory();
  const styles = useStyles();

  const [enrolmentNo, setEnrolmentNo] = useState("");
  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      const res = await login({ scn: enrolmentNo, password: passcode, email });
      if (res?.succeeded) {
        history.push("/dashboard");
      }
      setIsLoading(false);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to log in. Please check your credentials.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthLayout>
        <div className={styles.container}>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className={styles.input_wrapper}>
              <label htmlFor="enrolmentNo" className={styles.label}>
                Enter enrolment number
              </label>
              <input
                name="enrolmentNo"
                id="enrolmentNo"
                type="text"
                value={enrolmentNo}
                onChange={(e) => setEnrolmentNo(e.target.value)}
                className={styles.input}
                placeholder="SCN******"
              />
            </div>
            <div className={styles.input_wrapper}>
              <label htmlFor="email" className={styles.label}>
                Enter email
              </label>
              <input
                name="email"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="sample@gmail.com"
              />
            </div>
            <div className={styles.input_wrapper}>
              <label htmlFor="passcode" className={styles.label}>
                Enter password
              </label>
              <input
                name="passcode"
                id="passcode"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className={styles.input}
                placeholder="********"
              />
            </div>
            <div className={styles.button_wrapper}>
              <button type="submit" className={styles.button} disabled={isLoading || (!enrolmentNo && !passcode)}>
                <span>Sign In to your Account</span>
                {isLoading && <div className={styles.loader}></div>}
              </button>
            </div>
          </form>
        </div>
      </AuthLayout>
    </>
  );
};

export default Signin;
