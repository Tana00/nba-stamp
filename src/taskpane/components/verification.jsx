import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles, Image } from "@fluentui/react-components";
import PinVerification from "./PinVerification";
import { verifyOTP, resendOTP } from "../api";
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
  },
  wrapper: {
    width: "100%",
    marginTop: "2rem",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  shield: {
    width: "122px",
    height: "124px",
    marginTop: "1rem",
    marginBottom: "1.5rem",
  },
  text: {
    fontSize: "16px",
    color: "#000000B2",
    fontWeight: 500,
    fontFamily: "'Poppins', sans-serif",
    textAlign: "center",
    margin: "1rem 1.5rem",
  },
  pin_wrapper: {
    marginTop: "1.5rem",
  },
  resend_link: {
    width: "fit-content",
    fontSize: "13px",
    fontWeight: 600,
    color: "#00000080",
    fontFamily: "'DM Sans', sans-serif",
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
    textAlign: "end",
    cursor: "pointer",
    marginTop: 0,
    "&:hover": {
      textDecoration: "underline",
    },
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

const Verification = () => {
  const history = useHistory();
  const styles = useStyles();

  const email = useAuthStore((state) => state.email);
  const enrolmentNo = useAuthStore((state) => state.enrolmentNo);

  const [pin, setPin] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    if (timer > 0) {
      timerRef.current = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timer]);

  const handleRequestNewPin = () => {
    setIsLoading(true);
    try {
      const res = resendOTP({ enrolmentNo });
      if (res?.succeeded) {
        setIsLoading(false);
        setPin(new Array(6).fill(""));
        setTimer(60);
      }
    } catch (error) {
      // history.push("/");
    }
  };

  const handlePinComplete = async (completePin) => {
    // Convert numbers to strings and join them
    const pinString = completePin.map((num) => num.toString()).join("");

    history.push("/loader");
    await verifyOTP(pinString);
  };

  return (
    <div className={styles.root}>
      <section className={styles.box}>
        <div className={styles.wrapper}>
          <Image width="90" height="90" src="assets/protect.png" alt="shield" className={styles.shield} />
          <p className={styles.text}>
            A Verification code has been sent to your email {email}. Kindly check the email and input the code
          </p>
          <div className={styles.pin_wrapper}>
            <div className={styles.pin_container}>
              <PinVerification setPin={setPin} pin={pin} handlePinComplete={handlePinComplete} />
            </div>
            {timer > 0 ? (
              <p className={styles.resend_link}>Resend Code in {timer}s</p>
            ) : (
              <p className={styles.resend_link} onClick={handleRequestNewPin}>
                {!isLoading ? "Resend Code" : <div className={styles.loader}></div>}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Verification;
