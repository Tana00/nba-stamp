import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@fluentui/react-components";
import { register } from "../api";

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
  box: {
    margin: "auto",
    // height: "100vh",
    display: "flex",
    padding: "10px",
  },
  wrapper: {
    width: "100%",
    // margin: "auto",
  },
  header: {
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    "& h2": {
      color: "#000000B2",
      fontSize: "17px",
      fontWeight: 500,
      fontFamily: "'Poppins', sans-serif",
      marginBottom: ".8rem",
    },
    "& p": {
      fontSize: "12px",
      fontWeight: 700,
      color: "#000",
      fontFamily: "'DM Sans', sans-serif",
    },
  },
  indicatorWrapper: {
    display: "flex",
    alignItems: "center",
    margin: "auto",
    gap: "6px",
    marginTop: "1rem",
    marginBottom: ".2rem",
  },
  indicator: {
    backgroundColor: "#2E6A36",
    height: "4.86px",
    borderRadius: "12.14px",
    width: "10.93px",
  },
  activeIndicator: {
    width: "23.06px",
  },
  container: {
    width: "100%",
    maxWidth: "427px",
    margin: "auto",
    padding: "6px 0",
    position: "relative",
    marginTop: "2.5rem",
  },
  input_wrapper: {
    display: "flex",
    flexDirection: "column",
    marginTop: "1rem",
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
    marginTop: "2rem",
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
    "&:disabled": {
      opacity: ".5",
      cursor: "not-allowed",
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

const SignUp = () => {
  const history = useHistory();
  const styles = useStyles();

  const [activeStep, setActiveStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [enrolmentNo, setEnrolmentNo] = useState("");
  const [address, setAddress] = useState("");
  const [passcode, setPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const step1Filled = name.trim() !== "" && isValidEmail(email) && enrolmentNo.trim() !== "";

  // Check fields for step 2
  const isValidPasscode = /^\d{6}$/.test(passcode.trim());
  const step2Filled =
    address.trim() !== "" && passcode.trim() !== "" && confirmPasscode.trim() !== "" && passcode === confirmPasscode;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeStep === 1) {
      setActiveStep(2);
    } else if (activeStep === 2) {
      if (!isValidPasscode) {
        setError("Passcode must be exactly 6 digits.");
        return;
      }
      try {
        const payload = {
          name,
          enrolmentNo,
          email,
          officeAddress: address,
          passcode,
          confirmPasscode,
        };
        setIsLoading(true);
        setError(null);
        const res = await register(payload);
        if (res?.succeeded) {
          history.push("/verification");
        }
        setIsLoading(false);
      } catch (err) {
        console.log(err.response.data.message);
        setError(err?.response?.data?.message || "Failed to create account. Please try again");
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.root}>
      <section className={styles.box}>
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <h2>Create an account</h2>
            <div className={styles.indicatorWrapper}>
              <div
                onClick={() => {
                  if (activeStep === 2) {
                    setActiveStep(1);
                  }
                }}
                className={`${activeStep === 1 && styles.activeIndicator} ${styles.indicator}`}
              ></div>
              <div
                onClick={() => {
                  if (step1Filled) {
                    setActiveStep(2);
                  }
                }}
                className={`${activeStep === 2 && styles.activeIndicator} ${styles.indicator}`}
              ></div>
            </div>
            <p>{activeStep} of 2</p>
          </div>
          <div className={styles.container}>
            {error && <p className={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit}>
              {activeStep === 1 ? (
                <>
                  <div className={styles.input_wrapper}>
                    <label htmlFor="name" className={styles.label}>
                      Enter name
                    </label>
                    <input
                      name="name"
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={styles.input}
                      placeholder="Taiwo Emeka Musa"
                    />
                  </div>
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
                      placeholder="Lekansogbein@gmail.com"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.input_wrapper}>
                    <label htmlFor="address" className={styles.label}>
                      Enter address
                    </label>
                    <input
                      name="address"
                      id="address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={styles.input}
                      placeholder="1 Lekki phase 1, Admiralty waya"
                    />
                  </div>
                  <div className={styles.input_wrapper}>
                    <label htmlFor="passcode" className={styles.label}>
                      Create passcode
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
                    <label htmlFor="confirmPasscode" className={styles.label}>
                      Confirm passcode
                    </label>
                    <input
                      name="confirmPasscode"
                      id="confirmPasscode"
                      type="password"
                      value={confirmPasscode}
                      onChange={(e) => setConfirmPasscode(e.target.value)}
                      className={styles.input}
                      placeholder="********"
                    />
                  </div>
                </>
              )}

              <div className={styles.button_wrapper}>
                <button
                  type="submit"
                  className={styles.button}
                  disabled={isLoading || (activeStep === 1 ? !step1Filled : !step2Filled)}
                >
                  <span>{activeStep === 1 ? "Next" : "Proceed"}</span>
                  {isLoading && <div className={styles.loader}></div>}
                </button>
                <p className={styles.no_account}>
                  Already have an account?{" "}
                  <span className={styles.sign_up_link} onClick={() => history.push("/signin")}>
                    Sign in
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignUp;
