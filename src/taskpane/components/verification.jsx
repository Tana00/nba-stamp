import React, { useState, useEffect, useRef } from "react";
// import { useHistory } from "react-router-dom";
import { makeStyles } from "@fluentui/react-components";
import PinVerification from "./PinVerification";
import AuthLayout from "./layout/authLayout";

const useStyles = makeStyles({
  text: {
    fontSize: "16px",
    color: "#000000B2",
    fontWeight: 500,
    fontFamily: "'Poppins', sans-serif",
    textAlign: "center",
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
    justifyContent: "end",
    textAlign: "end",
    cursor: "pointer",
    marginTop: 0,
    "&:hover": {
      textDecoration: "underline",
    },
  },
});

const Verification = () => {
  //   const history = useHistory();
  const styles = useStyles();

  const [pin, setPin] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);

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
    setPin(new Array(6).fill(""));
    setTimer(60);
  };

  return (
    <AuthLayout>
      <div>
        <p className={styles.text}>
          A Verification code has been sent to your email Lek*******in@gmail.com. Kindly check the email and input the
          code
        </p>
        <div className={styles.pin_wrapper}>
          <div className={styles.pin_container}>
            <PinVerification setPin={setPin} pin={pin} />
          </div>
          {timer > 0 ? (
            <p className={styles.resend_link}>Resend Code in {timer}s</p>
          ) : (
            <p className={styles.resend_link} onClick={handleRequestNewPin}>
              Resend Code
            </p>
          )}
        </div>
      </div>
    </AuthLayout>
  );
};

export default Verification;
