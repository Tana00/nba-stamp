import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@fluentui/react-components";
import { useBoolean } from "@fluentui/react-hooks";
import { getDashboardData, buyStamp } from "../api";
import Spinner from "./shared/Spinner";
import { useAuthStore } from "../store";
import { PopupModal } from "./shared/PopupModal";

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
  loader_wrapper: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
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
  box: {
    margin: "10px",
  },
  container: {
    width: "100%",
    maxWidth: "427px",
    margin: "6px auto",
    backgroundColor: "transparent",
    padding: "6px 0",
  },
  content: {
    borderRadius: "10px",
    backgroundColor: "#fff",
    padding: "15px 25px",
    "& .close_icon": {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      textAlign: "end",
      marginLeft: "auto",
      cursor: "pointer",
    },
    "& .title": {
      fontSize: "16px",
      fontWeight: 600,
      color: "#000000CC",
      fontFamily: "'Poppins', sans-serif",
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
      marginBottom: "1.2rem",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ":disabled": {
        backgroundColor: "#F1F1F1",
        color: "#AFAFAF",
      },
    },
    "& .question": {
      fontSize: "18px",
      fontWeight: 500,
      textAlign: "center",
      fontFamily: "'Poppins', sans-serif",
    },
    "& .cancel_btn": {
      color: "#FE4141",
      border: "1px solid #FE4141",
      borderRadius: "10px",
      width: "300px",
      background: "transparent",
      margin: "2rem",
      marginBottom: 0,
    },
    "& .confirm_btn": {
      width: "300px",
      margin: "1.5rem 2rem 2rem 2rem",
    },
  },
  input_wrapper: {
    margin: "1rem 0",
    "& label": {
      fontSize: "14px",
      fontWeight: 600,
      color: "#000000CC",
      fontFamily: "'Poppins', sans-serif",
    },
    "& input": {
      border: "1px solid #00000080",
      marginTop: ".5rem",
      borderRadius: "5px",
      height: "50px",
      width: "400px",
      paddingLeft: "10px",
      fontSize: "14px",
      "::placeholder": {
        color: "#00000033",
      },
    },
  },
  text: {
    fontSize: "16px",
    fontWeight: 400,
    fontFamily: "'Poppins', sans-serif",
    margin: 0,
  },
  title: {
    fontWeight: 500,
    marginTop: "2rem",
  },
  wrapper: {
    marginTop: ".2rem",
    backgroundColor: "#2E6A36",
    borderRadius: "10px",
    padding: "1rem 2rem",
    "& .text": {
      color: "#fff",
      margin: 0,
    },
  },
  inner_box: {
    backgroundColor: "#FFFFFFCC",
    borderRadius: "10px",
    border: "1px solid #0000001A",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "30px",
    marginTop: "1rem",
    padding: "1.5rem",
    "& .stamp_count": {
      color: "#000",
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 600,
      fontSize: "16px",
      textAlign: "center",
      margin: 0,
    },
  },
  image: {},
  button_wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    width: "100%",
  },
  button: {
    backgroundColor: "#fff",
    border: 0,
    height: "55px",
    width: "100%",
    borderRadius: "6px",
    cursor: "pointer",
    fontFamily: "'Poppins', sans-serif",
    fontSize: "14px",
    fontWeight: 500,
    color: "#000",
    ":disabled": {
      backgroundColor: "#F1F1F1",
      color: "#AFAFAF",
    },
  },
  forgot_password: {
    width: "fit-content",
    fontSize: "12px",
    fontWeight: 400,
    color: "#0000004D",
    fontFamily: "'Poppins', sans-serif",
    marginLeft: "auto",
    display: "flex",
    justifyContent: "end",
    textAlign: "end",
    marginTop: "4px",
  },
  amount_wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: "4rem auto 10px auto",
  },
  total_amount: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#000",
    fontFamily: "'Poppins', sans-serif",
    margin: 0,
  },
  amount: {
    fontSize: "24px",
    fontWeight: 600,
    fontFamily: "'Poppins', sans-serif",
    margin: 0,
  },
  active_amount: {
    color: "#2E6A36",
  },
  inactive_amount: {
    color: "#00000033",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    flexWrap: "wrap",
    "& button": {
      border: "none",
      background: "transparent",
      fontSize: "14px",
      fontWeight: 500,
      color: "#FE4141",
      fontFamily: "'DM Sans', sans-serif",
      cursor: "pointer",
      ":hover": {
        textDecoration: "underline",
      },
    },
  },
  radio_input_wrapper: {
    margin: ".5rem 0",
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
    gap: "0.5rem",
    "& label": {
      fontSize: "14px",
      fontWeight: 600,
      color: "#000000CC",
      fontFamily: "'Poppins', sans-serif",
      display: "flex",
      alignItems: "center",
      // justifyContent: "center",
    },
  },
  radio_group: {
    display: "flex",
    alignItems: "center",
    // flexDirection: "column",
    gap: "1.2rem",
    width: "91%",
    "& label:last-child": {
      width: "100%",
    },
  },
  radio_label: {
    padding: "0.5rem 1rem",
    width: "100%",
    cursor: "pointer",
    "& span": {
      fontSize: "14px",
      color: "#9c9c9c",
      fontWeight: 400,
    },
  },
  radio_input: {
    opacity: 0,
    position: "absolute",
    left: "-9999px",
  },
  radio_image: {
    width: "40px",
    height: "40px",
    marginRight: "8px",
  },
  selected: {
    // border: "1px solid #2E6A36",
    borderRadius: "5px",
    "& span": {
      color: "#2e6a36",
      fontWeight: 600,
    },
    "& img": {
      width: "50px",
      height: "50px",
    },
  },
  error: {
    fontSize: "12px",
    color: "#FE4141",
    fontWeight: 500,
  },
});

const Dashboard = () => {
  const history = useHistory();
  const styles = useStyles();

  const isTokenExpired = useAuthStore((state) => state.isTokenExpired);
  const clearLoginData = useAuthStore((state) => state.clearLoginData);
  const name = useAuthStore((state) => state.name);

  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  // const [passcode, setPasscode] = useState("");
  const [stampCount, setStampCount] = useState("");
  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [stampType, setStampType] = useState("private");

  const [isPopupVisible, { setTrue: showPopup, setFalse: hidePopup }] = useBoolean(false);
  const [isConfirmPaymentPopup, { setTrue: showConfirmPaymentPopup, setFalse: hideConfirmPaymentPopup }] =
    useBoolean(false);

  const handleResetFields = () => {
    setAmount(0);
    setStampCount("");
  };

  const fetchData = async () => {
    try {
      const data = await getDashboardData();
      setDashboardData(data?.data);
      hideConfirmPaymentPopup();
      handleResetFields();
      return data?.data?.availableQty;
    } catch (error) {
      setError("Failed to fetch dashboard data");
      history.push("/signin");
    }
  };

  const handleBuyStamp = async () => {
    try {
      const data = await buyStamp({ quantity: stampCount, amount, isPublic: stampType === "public" });
      if (data) {
        if (data?.data?.authorizationUrl) {
          window.open(data?.data?.authorizationUrl, "_blank");
          showConfirmPaymentPopup();
        } else {
          setError(data?.message);
        }
        hidePopup();
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      setError("Failed to fetch dashboard data");
    }
  };

  const isDisabled = () => {
    const numericValue = parseFloat(stampCount);
    return isNaN(numericValue) || numericValue < 50;
  };

  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return formatter.format(amount);
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 10000); // 10 seconds

      // Cleanup function to clear the timer if the component unmounts or if error changes
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    fetchData();
  }, []);

  if (!dashboardData) {
    return (
      <div className={styles.loader_wrapper}>
        <Spinner />
      </div>
    );
  }

  if (isTokenExpired()) {
    history.push("/signin");
  }

  return (
    <>
      <div className={styles.root}>
        <div className={styles.box}>
          <div className={styles.container}>
            <div className={styles.header}>
              <p className={styles.text}>Welcome Back, {name}</p>

              <button
                onClick={() => {
                  clearLoginData();
                  history.push("/signin");
                }}
              >
                Log Out
              </button>
            </div>
            {error && <div className={styles.error}>Error: {error}</div>}
            <div>
              <p className={styles.title}>NBA Stamp & Seal</p>
              <div className={styles.wrapper}>
                <p className="text">Stamp and seal Wallet</p>
                <div className={styles.inner_box}>
                  <div>
                    <img src="../../../assets/stampWallet.png" alt="stamps" className={styles.image} />
                    <p className="stamp_count">{dashboardData?.availableQty} Stamps</p>
                  </div>
                  <div className={styles.button_wrapper}>
                    <button
                      className={styles.button}
                      onClick={() => {
                        showPopup();
                      }}
                    >
                      Buy Stamp
                    </button>
                    <button
                      className={styles.button}
                      onClick={() => history.push("affix-stamp")}
                      disabled={dashboardData?.availableQty === 0 || !dashboardData?.availableQty}
                    >
                      Affix Stamp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <Stamp name={name} scn={scn} number={number} validTill={validTill} /> */}
        </div>
      </div>
      {isPopupVisible && (
        <PopupModal
          hidePopup={hidePopup}
          content={
            <div className={styles.content}>
              <svg
                className="close_icon"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={hidePopup}
              >
                <path
                  d="M11.2 21.744L16 16.944L20.8 21.744L21.744 20.8L16.944 16L21.744 11.2L20.8 10.256L16 15.056L11.2 10.256L10.256 11.2L15.056 16L10.256 20.8L11.2 21.744ZM16.004 28C14.3453 28 12.7853 27.6853 11.324 27.056C9.86356 26.4258 8.59289 25.5707 7.512 24.4907C6.43111 23.4107 5.57556 22.1413 4.94533 20.6827C4.31511 19.224 4 17.6644 4 16.004C4 14.3436 4.31511 12.7836 4.94533 11.324C5.57467 9.86356 6.42844 8.59289 7.50667 7.512C8.58489 6.43111 9.85467 5.57556 11.316 4.94533C12.7773 4.31511 14.3373 4 15.996 4C17.6547 4 19.2147 4.31511 20.676 4.94533C22.1364 5.57467 23.4071 6.42889 24.488 7.508C25.5689 8.58711 26.4244 9.85689 27.0547 11.3173C27.6849 12.7778 28 14.3373 28 15.996C28 17.6547 27.6853 19.2147 27.056 20.676C26.4267 22.1373 25.5716 23.408 24.4907 24.488C23.4098 25.568 22.1404 26.4236 20.6827 27.0547C19.2249 27.6858 17.6653 28.0009 16.004 28ZM16 26.6667C18.9778 26.6667 21.5 25.6333 23.5667 23.5667C25.6333 21.5 26.6667 18.9778 26.6667 16C26.6667 13.0222 25.6333 10.5 23.5667 8.43333C21.5 6.36667 18.9778 5.33333 16 5.33333C13.0222 5.33333 10.5 6.36667 8.43333 8.43333C6.36667 10.5 5.33333 13.0222 5.33333 16C5.33333 18.9778 6.36667 21.5 8.43333 23.5667C10.5 25.6333 13.0222 26.6667 16 26.6667Z"
                  fill="black"
                />
              </svg>
              <div className={styles.input_wrapper}>
                <label htmlFor="stampCount">Enter number of stamp</label>
                <input
                  id="stampCount"
                  type="number"
                  value={stampCount}
                  onChange={(e) => {
                    const value = e.target.value;
                    setStampCount(value);
                    setAmount(value * 1000);
                  }}
                  placeholder="50"
                />
                <p className={styles.forgot_password}>Minimum of 50 Stamps</p>
              </div>
              <div className={styles.radio_input_wrapper}>
                <label className={styles.label}>Stamp type</label>
                <div className={styles.radio_group}>
                  <label
                    htmlFor="private"
                    className={`${styles.radio_label} ${stampType === "private" ? styles.selected : ""}`}
                  >
                    <input
                      type="radio"
                      id="private"
                      name="stampType"
                      value="private"
                      checked={stampType === "private"}
                      onChange={(e) => setStampType(e.target.value)}
                      className={styles.radio_input}
                    />
                    <img src="../../../assets/stamp1.svg" alt="Private Stamp" className={styles.radio_image} />
                    <span>Private</span>
                  </label>
                  <label
                    htmlFor="public"
                    className={`${styles.radio_label} ${stampType === "public" ? styles.selected : ""}`}
                  >
                    <input
                      type="radio"
                      id="public"
                      name="stampType"
                      value="public"
                      checked={stampType === "public"}
                      onChange={(e) => setStampType(e.target.value)}
                      className={styles.radio_input}
                    />
                    <img src="../../../assets/pink-stamp.svg" alt="Public Stamp" className={styles.radio_image} />
                    <span>Public</span>
                  </label>
                </div>
              </div>

              <div className={styles.amount_wrapper}>
                <p className={styles.total_amount}>Total amount</p>
                <p className={`${styles.amount} ${stampCount >= 50 ? styles.active_amount : styles.inactive_amount}`}>
                  {formatCurrency(amount)}
                </p>
              </div>
              <button
                onClick={() => {
                  handleBuyStamp();
                  setIsLoading(true);
                }}
                disabled={isDisabled()}
              >
                <span>Continue</span>
                {isLoading && <div className={styles.loader}></div>}
              </button>
              {error && <div className={styles.error}>Error: {error}</div>}
            </div>
          }
        />
      )}

      {isConfirmPaymentPopup && (
        <PopupModal
          hidePopup={hideConfirmPaymentPopup}
          content={
            <div className={styles.content}>
              <p className="question">Have you successfully made payment?</p>
              {/* <button
                onClick={() => {
                  hideConfirmPaymentPopup();
                  handleResetFields();
                }}
                className="cancel_btn"
              >
                <span>No</span>
              </button> */}

              <button
                onClick={() => {
                  fetchData();
                }}
                className="confirm_btn"
              >
                <span>Continue</span>
                {isLoading && <div className={styles.loader}></div>}
              </button>
            </div>
          }
        />
      )}
    </>
  );
};

export default Dashboard;
