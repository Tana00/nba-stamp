import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@fluentui/react-components";
import AuthLayout from "./layout/authLayout";
import { resetPasscode } from "../api";

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
    marginTop: ".5rem",
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
});

const ResetPasscode = () => {
  const history = useHistory();
  const styles = useStyles();

  const [enrolmentNo, setEnrolmentNo] = useState("");
  const [passcode, setPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      const res = await resetPasscode(enrolmentNo, passcode);
      if (res?.succeeded) {
        history.push("/signin");
      }
      setIsLoading(false);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to reset passcode. Please check your credentials.");
      setIsLoading(false);
    }
  };

  return (
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
            <label htmlFor="passcode" className={styles.label}>
              Enter passcode
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
          <div className={styles.input_wrapper}>
            <label htmlFor="confirm_passcode" className={styles.label}>
              Enter confirm passcode
            </label>
            <input
              name="confirm_passcode"
              id="confirm_passcode"
              type="password"
              value={confirmPasscode}
              onChange={(e) => setConfirmPasscode(e.target.value)}
              className={styles.input}
              placeholder="********"
            />
          </div>
          <div className={styles.button_wrapper}>
            <button type="submit" className={styles.button} disabled={isLoading || (!enrolmentNo && !passcode)}>
              <span>Reset Passcode</span>
              {isLoading && <div className={styles.loader}></div>}
            </button>
            <p className={styles.no_account}>
              <span className={styles.sign_up_link} onClick={() => history.push("/signin")}>
                Remember Passcode?
              </span>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ResetPasscode;
