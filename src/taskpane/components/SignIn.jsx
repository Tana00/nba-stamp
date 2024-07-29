import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@fluentui/react-components";
import { useBoolean } from "@fluentui/react-hooks";
import AuthLayout from "./layout/authLayout";
import { login, forgotPasscode, verifyForgotPasscodeOTP } from "../api";
import { PopupModal } from "./shared/PopupModal";

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
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [token, setToken] = useState(0);

  const [isPopupVisible, { setTrue: showPopup, setFalse: hidePopup }] = useBoolean(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      const res = await login(enrolmentNo, passcode);
      if (res?.succeeded) {
        history.push("/dashboard");
      }
      setIsLoading(false);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to log in. Please check your credentials.");
      setIsLoading(false);
    }
  };

  const handleForgotPasscode = async () => {
    try {
      const res = await forgotPasscode({ enrolmentNo });
      if (res?.succeeded) {
        setIsLoading(false);
        setForgotPasswordStep(2);
      }
    } catch (error) {
      // history.push("/");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const res = await verifyForgotPasscodeOTP({ top: token });
      if (res?.succeeded) {
        setIsLoading(false);
        setForgotPasswordStep(1);
        history.push("/reset-passcode");
      }
    } catch (error) {
      // history.push("/");
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
              <p
                className={styles.forgot_password}
                onClick={() => {
                  showPopup();
                  setEnrolmentNo("");
                }}
              >
                Forgot Passcode?
              </p>
            </div>
            <div className={styles.button_wrapper}>
              <button type="submit" className={styles.button} disabled={isLoading || (!enrolmentNo && !passcode)}>
                <span>Sign In to your Account</span>
                {isLoading && <div className={styles.loader}></div>}
              </button>
              <p className={styles.no_account}>
                Don&apos;t have an account?{" "}
                <span className={styles.sign_up_link} onClick={() => history.push("/signup")}>
                  Sign up
                </span>
              </p>
            </div>
          </form>
        </div>
      </AuthLayout>
      {isPopupVisible && (
        <PopupModal
          hidePopup={() => {
            hidePopup();
            setEnrolmentNo("");
          }}
          content={
            <div className={styles.content}>
              <div className="header">
                <p className="title">Forgot Passcode?</p>
                <svg
                  className="close_icon"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => {
                    hidePopup();
                    setEnrolmentNo("");
                  }}
                >
                  <path
                    d="M11.2 21.744L16 16.944L20.8 21.744L21.744 20.8L16.944 16L21.744 11.2L20.8 10.256L16 15.056L11.2 10.256L10.256 11.2L15.056 16L10.256 20.8L11.2 21.744ZM16.004 28C14.3453 28 12.7853 27.6853 11.324 27.056C9.86356 26.4258 8.59289 25.5707 7.512 24.4907C6.43111 23.4107 5.57556 22.1413 4.94533 20.6827C4.31511 19.224 4 17.6644 4 16.004C4 14.3436 4.31511 12.7836 4.94533 11.324C5.57467 9.86356 6.42844 8.59289 7.50667 7.512C8.58489 6.43111 9.85467 5.57556 11.316 4.94533C12.7773 4.31511 14.3373 4 15.996 4C17.6547 4 19.2147 4.31511 20.676 4.94533C22.1364 5.57467 23.4071 6.42889 24.488 7.508C25.5689 8.58711 26.4244 9.85689 27.0547 11.3173C27.6849 12.7778 28 14.3373 28 15.996C28 17.6547 27.6853 19.2147 27.056 20.676C26.4267 22.1373 25.5716 23.408 24.4907 24.488C23.4098 25.568 22.1404 26.4236 20.6827 27.0547C19.2249 27.6858 17.6653 28.0009 16.004 28ZM16 26.6667C18.9778 26.6667 21.5 25.6333 23.5667 23.5667C25.6333 21.5 26.6667 18.9778 26.6667 16C26.6667 13.0222 25.6333 10.5 23.5667 8.43333C21.5 6.36667 18.9778 5.33333 16 5.33333C13.0222 5.33333 10.5 6.36667 8.43333 8.43333C6.36667 10.5 5.33333 13.0222 5.33333 16C5.33333 18.9778 6.36667 21.5 8.43333 23.5667C10.5 25.6333 13.0222 26.6667 16 26.6667Z"
                    fill="black"
                  />
                </svg>
              </div>
              {/* Step 1 */}
              {forgotPasswordStep === 1 && (
                <>
                  <div className={`${styles.input_wrapper} input_wrapper`}>
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
                  <button
                    onClick={() => {
                      setIsLoading(true);
                      handleForgotPasscode();
                    }}
                    disabled={!enrolmentNo}
                  >
                    <span>Done</span>
                    {isLoading && <div className={styles.loader}></div>}
                  </button>
                </>
              )}
              {/* Step 2 */}
              {forgotPasswordStep === 2 && (
                <>
                  <p className="title">Enter token sent to your email for verification</p>
                  <div className={styles.input_wrapper}>
                    <label htmlFor="token" className={styles.label}>
                      Enter token
                    </label>
                    <input
                      name="token"
                      id="token"
                      type="password"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className={styles.input}
                      placeholder="******"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setIsLoading(true);
                      handleVerifyOTP();
                    }}
                    disabled={!token}
                  >
                    <span>Verify</span>
                    {isLoading && <div className={styles.loader}></div>}
                  </button>
                </>
              )}
            </div>
          }
        />
      )}
    </>
  );
};

export default Signin;
