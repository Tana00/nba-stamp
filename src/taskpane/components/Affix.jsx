import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@fluentui/react-components";
import { useBoolean } from "@fluentui/react-hooks";
import AffixLayout from "./layout/affixLayout";
import { PopupModal } from "./shared/PopupModal";
import {
  insertImageBottomRightFromLocalPath,
  removePlaceholderImages,
  preparePDFDownload,
  initiateDownload,
  replaceOriginalsWithPlaceholders,
} from "../taskpane";
// import PinVerification from "./PinVerification";
import Spinner from "./shared/Spinner";
import { useAuthStore } from "../store";
import { CustomDatePicker } from "./DatePicker";
import { affixStamp, setQRCode } from "../api";
import { getImageBase64FromLocalPath, affixTextOnImage } from "../helpers/imageToBase64";
import { dateTimeToEpoch } from "../helpers/dateTimeToEpoch";

const steps = [
  {
    id: 1,
    label: "Enter Document Details",
  },
  {
    id: 2,
    label: "Position your Stamp",
  },
  {
    id: 3,
    label: "Affix your Stamp",
  },
];

const useStyles = makeStyles({
  wrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: "10px auto",
    gap: "25px",
  },
  step_container: {
    width: "100%",
  },
  step: {
    border: "1px solid #D6D6D6",
    borderRadius: "6.6px",
    height: "55px",
    padding: "0px 10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "-webkit-fill-available",
    "& .text": {
      color: "#0000004D",
      fontSize: "14px",
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 600,
    },
    "& .completed": {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: "6px",
      "& p": {
        color: "#000",
        fontSize: "12px",
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 600,
      },
    },
  },
  activeStep: {
    backgroundColor: "#2E6A36",
    border: "1px solid #2E6A36",
    cursor: "pointer",
    "& .text": {
      color: "#FFFFFF",
    },
  },
  completedStep: {
    backgroundColor: "#2E6A361A",
    border: "1px solid #2E6A36",
    cursor: "pointer",
    "& .text": {
      color: "#000000",
    },
  },
  dropdown: {
    "& div": {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      border: "1px solid #0000001A",
      borderTop: 0,
      borderRadius: "5px",
      padding: "4px 10px 4px 30px",
      cursor: "pointer",
      "& p": {
        color: "#000",
        fontSize: "13px",
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 500,
      },
      "& input": {
        accentColor: "#2E6A36",
        width: "15px",
        height: "15px",
      },
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
      margin: "1.2rem 0",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ":disabled": {
        backgroundColor: "#F1F1F1",
        color: "#AFAFAF",
      },
    },
    "& .error": {
      fontSize: "12px",
      color: "#FE4141",
      fontWeight: 500,
    },
  },
  confirmContent: {
    width: "400px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    position: "relative",
    minHeight: "320px",
    padding: "1rem 2rem",
    overflow: "hidden",
    "& .close_icon": {
      position: "absolute",
      right: "1.5rem",
      top: "1.5rem",
      width: "1.5rem",
      height: "1.5rem",
    },
    "& .title": {
      fontSize: "15px",
      textAlign: "center",
      marginTop: "1.5rem",
      "& span": {
        color: "#E10303",
      },
    },
    "& .buttons": {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      marginTop: "1rem",
      "& .cancel_btn": {
        fontSize: "14px",
        fontWeight: 600,
        fontFamily: "'Poppins', sans-serif",
        height: "50px",
        width: "100%",
        borderRadius: "10px",
        backgroundColor: "transparent",
        color: "#000",
        border: "1px solid #2E6A36",
        cursor: "pointer",
        ":focus-visible": {
          outline: "none",
        },
      },
      "& .proceed_btn": {
        fontSize: "14px",
        fontWeight: 600,
        fontFamily: "'Poppins', sans-serif",
        height: "50px",
        width: "100%",
        borderRadius: "10px",
        backgroundColor: "#2E6A36",
        color: "#fff",
        border: 0,
        cursor: "pointer",
      },
    },
  },
  input_wrapper: {
    display: "flex",
    flexDirection: "column",
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
      // width: "100%",
      paddingLeft: "10px",
      fontSize: "14px",
      "::placeholder": {
        color: "#00000033",
      },
    },
  },
  passcode: {
    width: "100%",
    textAlign: "start",
    margin: "1rem auto",
    "& p": {
      fontSize: "14px",
      fontWeight: 500,
      fontFamily: "'Poppins', sans-serif",
      color: "#000",
      marginBottom: 0,
    },
  },
  success: {
    textAlign: "center",
    margin: "0 auto 1.5rem auto",
    "& img": {
      height: "8rem",
    },
    "& p": {
      fontFamily: "'Poppins', sans-serif",
      color: "#000",
      ":first-of-type": {
        fontSize: "24px",
        fontWeight: 600,
        margin: 0,
      },
      ":last-of-type": {
        fontSize: "14px",
        fontWeight: 500,
        marginTop: "0",
        marginBottom: "2.5rem",
      },
    },
    "& button": {
      ":first-of-type": {
        fontSize: "14px",
        fontWeight: 600,
        fontFamily: "'Poppins', sans-serif",
        height: "50px",
        width: "100%",
        borderRadius: "10px",
        backgroundColor: "#2E6A36",
        color: "#fff",
        border: 0,
        cursor: "pointer",
        margin: 0,
        ":focus-visible": {
          outline: "none",
        },
      },
      ":last-of-type": {
        fontSize: "14px",
        fontWeight: 600,
        fontFamily: "'Poppins', sans-serif",
        height: "50px",
        width: "100%",
        borderRadius: "10px",
        backgroundColor: "transparent",
        color: "#000",
        border: "1px solid #00000026",
        cursor: "pointer",
        marginTop: "1rem",
        ":focus-visible": {
          outline: "none",
        },
      },
    },
  },
  no_stamps: {
    textAlign: "center",
    margin: "0 auto",
    "& img": {
      height: "6rem",
    },
    "& p": {
      fontFamily: "'Poppins', sans-serif",
      color: "#000",
      ":first-of-type": {
        fontSize: "28px",
        fontWeight: 600,
        marginTop: "3rem",
      },
      ":last-of-type": {
        fontSize: "15px",
        fontWeight: 500,
        marginBottom: "0",
        marginTop: "2.5rem",
      },
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

const AffixSteps = () => {
  const history = useHistory();
  const styles = useStyles();

  const [active, setActive] = useState(1);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationStep, setConfirmationStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [completePasscode, setCompletePasscode] = useState("");
  const [availableStamp, setAvailableStamp] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const downloadStatus = useAuthStore((state) => state.downloadStatus);
  // const downloadURL = useAuthStore((state) => state.downloadURL);
  // const downloadBlob = useAuthStore((state) => state.downloadBlob);
  const setDownloadStatus = useAuthStore((state) => state.setDownloadStatus);
  const stampSignature = useAuthStore((state) => state.stampSignature);
  const setBase64Stamps = useAuthStore((state) => state.setBase64Stamps);
  const setStampSignature = useAuthStore((state) => state.setStampSignature);

  const [isPopupVisible, { setTrue: showStep1Popup, setFalse: hideStep1Popup }] = useBoolean(false);
  const [isConfirmationPopup, { setTrue: showConfirmationPopup, setFalse: hideConfirmationPopup }] = useBoolean(false);

  const handleAffixStamp = async () => {
    setIsLoading(true);
    try {
      const res = await affixStamp({
        documentTitle: title,
        documentDate: dateTimeToEpoch(date)?.toString(),
        noOfPages: pageCount,
      });
      if (res?.succeeded) {
        await removePlaceholderImages();
        setIsLoading(false);
        hideStep1Popup();
        setActive(2);
        const data = res?.data;

        // Convert the epoch to milliseconds (JavaScript Date uses milliseconds)
        const date = new Date(data?.expiryDate * 1000);

        // Extract the month and year
        const month = date.toLocaleString("default", { month: "long" });
        const year = date.getFullYear();
        const expiry = `${month} ${year}`;

        const isPublicStamp = data?.isPublic;

        const stampData = {
          name: data?.firstName + " " + data?.lastName,
          number: data?.enrolmentNo?.replace("scn", ""),
          qrCode: data?.stampSignature,
          expiry,
          isPublicStamp,
        };

        const base64 = await getImageBase64FromLocalPath(
          isPublicStamp ? "../../assets/pink-stamp.png" : "../../assets/green-stamp.png"
        );
        const finalImage = await affixTextOnImage(base64, stampData);

        // const footerBase64 = await getImageBase64FromLocalPath(
        //   isPublicStamp ? "../../assets/footer-pink-stamp.png" : "../../assets/footer-green-stamp.png"
        // );
        // const footerFinalImage = await affixTextOnImage(footerBase64, stampData);

        setBase64Stamps({ main: finalImage, footer: finalImage });
      } else {
        setIsLoading(false);
        setError(res?.message);
      }
    } catch (error) {
      setIsLoading(false);
      setError(error?.response?.data?.message || "An error occurred. Please try again");
    }
  };

  const handleSetQRCode = async (passcode) => {
    await preparePDFDownload();
    try {
      const res = await setQRCode({ stampSignature: stampSignature?.stampSignature, password: passcode });
      if (res?.succeeded) {
        initiateDownload(title);
        setConfirmationStep(3);
        setAvailableStamp(res?.data?.availableQty);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      await replaceOriginalsWithPlaceholders();
      console.log(error);
      setError(error?.response?.data?.message);
    }
  };

  const handleStampInsertion = async (pageCount) => {
    // const date = new Date("1743379200" * 1000);

    // // Extract the month and year
    // const month = date.toLocaleString("default", { month: "long" });
    // const year = date.getFullYear();
    // const expiry = `${month} ${year}`;

    // const isPublicStamp = false;

    // const stampData = {
    //   name: "Happiness Balogun",
    //   number: "000081",
    //   qrCode: "5484fbf6-cf1a-4428-b9da-ec4cfb2d25e0",
    //   expiry,
    //   isPublicStamp,
    // };

    // const base64 = await getImageBase64FromLocalPath(
    //   isPublicStamp ? "../../assets/pink-stamp.png" : "../../assets/green-stamp.png"
    // );
    // const finalImage = await affixTextOnImage(base64, stampData);

    // const footerBase64 = await getImageBase64FromLocalPath(
    //   isPublicStamp ? "../../assets/footer-pink-stamp.png" : "../../assets/footer-green-stamp.png"
    // );
    // const footerFinalImage = await affixTextOnImage(footerBase64, stampData);

    // setBase64Stamps({ main: finalImage, footer: footerFinalImage });
    await insertImageBottomRightFromLocalPath(pageCount);
  };

  // const handleOpenFile = () => {
  //   if (downloadBlob) {
  //     // Convert the blob to a Data URL
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const dataUrl = reader.result;
  //       window.open(dataUrl, "_blank");
  //     };
  //     reader.readAsDataURL(downloadBlob);
  //   } else {
  //     console.log("No Blob available to oprn the file");
  //   }
  // };

  useEffect(() => {
    // Define an async function inside the useEffect
    const handleAsyncOperation = async () => {
      if (downloadStatus !== null && downloadStatus === false) {
        setLoading(false);
        setConfirmationStep(4);
        setError("Unable to download. Please try again");
      }
    };

    // Call the async function
    handleAsyncOperation();
  }, [downloadStatus]);

  useEffect(() => {
    return () => {
      setDownloadStatus(null);
      setStampSignature(null);
      setBase64Stamps(null);
    };
  }, []);

  return (
    <>
      <AffixLayout>
        <div className={styles.wrapper}>
          {steps?.map((step) => (
            <div key={step?.id} className={styles.step_container}>
              <div
                onClick={async () => {
                  if (step.id === 1) {
                    showStep1Popup();
                    setDownloadStatus(null);
                    setConfirmationStep(1);
                    setError(null);
                    // await removePlaceholderImages();
                    // handleStampInsertion(pageCount);
                  }
                  if (step.id === 2 && active === 2) {
                    handleStampInsertion(pageCount);
                    setActive(3);
                  }
                  if (step.id === 3 && active === 3) {
                    showConfirmationPopup();
                  }
                }}
                className={`${active === step?.id ? styles.activeStep : active > step?.id ? styles.completedStep : ""} ${styles.step}`}
              >
                <p className="text">
                  Step {step?.id} - {step?.label}
                </p>
                {active > step?.id && (
                  <div className="completed">
                    <p>Completed!</p>
                    <img src="../../assets/green-check.png" alt="checked sign" className="check_sign" />
                  </div>
                )}
                {/* {active >= 2 && step.id === 2 && (
                  <div>
                    {openDropdown ? (
                      <svg width="17" height="10" viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M15.0564 0.0527343L16.9199 1.9194L8.93342 9.9194L0.94692 1.9194L2.81044 0.0527338L8.93342 6.18607L15.0564 0.0527343Z"
                          fill="#EBEBEB"
                        />
                      </svg>
                    ) : (
                      <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0 1.86352L1.86667 0L9.86667 7.9865L1.86667 15.973L0 14.1095L6.13333 7.9865L0 1.86352Z"
                          fill="#EBEBEB"
                        />
                      </svg>
                    )}
                  </div>
                )} */}
              </div>
              {/* {openDropdown && step.id === 2 && (
                <div className={styles.dropdown}>
                  <div onClick={() => setPositionStyle("default")}>
                    <p>Position your stamp on all pages by Default</p>
                    <input type="radio" name="positionStyle" checked={positionStyle === "default"} />
                  </div>
                  <div onClick={() => setPositionStyle("manual")}>
                    <p>Position your stamp on all pages manually</p>
                    <input type="radio" name="positionStyle" checked={positionStyle === "manual"} />
                  </div>
                </div>
              )} */}
            </div>
          ))}
        </div>
      </AffixLayout>
      {isPopupVisible && (
        <PopupModal
          hidePopup={() => {
            hideStep1Popup();
            setError(null);
          }}
          content={
            <div className={styles.content}>
              <svg
                className="close_icon"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => {
                  hideStep1Popup();
                  setError(null);
                }}
              >
                <path
                  d="M11.2 21.744L16 16.944L20.8 21.744L21.744 20.8L16.944 16L21.744 11.2L20.8 10.256L16 15.056L11.2 10.256L10.256 11.2L15.056 16L10.256 20.8L11.2 21.744ZM16.004 28C14.3453 28 12.7853 27.6853 11.324 27.056C9.86356 26.4258 8.59289 25.5707 7.512 24.4907C6.43111 23.4107 5.57556 22.1413 4.94533 20.6827C4.31511 19.224 4 17.6644 4 16.004C4 14.3436 4.31511 12.7836 4.94533 11.324C5.57467 9.86356 6.42844 8.59289 7.50667 7.512C8.58489 6.43111 9.85467 5.57556 11.316 4.94533C12.7773 4.31511 14.3373 4 15.996 4C17.6547 4 19.2147 4.31511 20.676 4.94533C22.1364 5.57467 23.4071 6.42889 24.488 7.508C25.5689 8.58711 26.4244 9.85689 27.0547 11.3173C27.6849 12.7778 28 14.3373 28 15.996C28 17.6547 27.6853 19.2147 27.056 20.676C26.4267 22.1373 25.5716 23.408 24.4907 24.488C23.4098 25.568 22.1404 26.4236 20.6827 27.0547C19.2249 27.6858 17.6653 28.0009 16.004 28ZM16 26.6667C18.9778 26.6667 21.5 25.6333 23.5667 23.5667C25.6333 21.5 26.6667 18.9778 26.6667 16C26.6667 13.0222 25.6333 10.5 23.5667 8.43333C21.5 6.36667 18.9778 5.33333 16 5.33333C13.0222 5.33333 10.5 6.36667 8.43333 8.43333C6.36667 10.5 5.33333 13.0222 5.33333 16C5.33333 18.9778 6.36667 21.5 8.43333 23.5667C10.5 25.6333 13.0222 26.6667 16 26.6667Z"
                  fill="black"
                />
              </svg>
              <p className="title">STEP 1 of 3</p>
              <div className={styles.input_wrapper}>
                <label htmlFor="title">Enter Document Title</label>
                <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className={styles.input_wrapper}>
                <label htmlFor="title">No of Pages</label>
                <input id="title" type="number" value={pageCount} onChange={(e) => setPageCount(e.target.value)} />
              </div>
              <div className={styles.input_wrapper}>
                <label htmlFor="date">Enter Date</label>
                <CustomDatePicker value={date} setValue={setDate} />
                {/* <input
                  id="date"
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="DD/MM/YYYY"
                /> */}
              </div>
              <button onClick={handleAffixStamp} disabled={!title || !date}>
                <span>Done</span>
                {isLoading && <div className={styles.loader}></div>}
              </button>
              {error && <p className="error">{error}</p>}
            </div>
          }
        />
      )}

      {isConfirmationPopup && (
        <PopupModal
          hidePopup={() => {
            hideConfirmationPopup();
            setDownloadStatus(null);
            setError(null);
            if (active === 3 && confirmationStep === 3) {
              history.push("/dashboard");
            }
            if (active === 3 && confirmationStep === 4) {
              setConfirmationStep(1);
            }
          }}
          content={
            <div className={`${styles.confirmContent} ${styles.content}`}>
              <svg
                className="close_icon"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => {
                  hideConfirmationPopup();
                  setDownloadStatus(null);
                  setError(null);
                  if (active === 3 && confirmationStep === 3) {
                    history.push("/dashboard");
                  }
                  if (active === 3 && confirmationStep === 4) {
                    setConfirmationStep(1);
                  }
                }}
              >
                <path
                  d="M11.2 21.744L16 16.944L20.8 21.744L21.744 20.8L16.944 16L21.744 11.2L20.8 10.256L16 15.056L11.2 10.256L10.256 11.2L15.056 16L10.256 20.8L11.2 21.744ZM16.004 28C14.3453 28 12.7853 27.6853 11.324 27.056C9.86356 26.4258 8.59289 25.5707 7.512 24.4907C6.43111 23.4107 5.57556 22.1413 4.94533 20.6827C4.31511 19.224 4 17.6644 4 16.004C4 14.3436 4.31511 12.7836 4.94533 11.324C5.57467 9.86356 6.42844 8.59289 7.50667 7.512C8.58489 6.43111 9.85467 5.57556 11.316 4.94533C12.7773 4.31511 14.3373 4 15.996 4C17.6547 4 19.2147 4.31511 20.676 4.94533C22.1364 5.57467 23.4071 6.42889 24.488 7.508C25.5689 8.58711 26.4244 9.85689 27.0547 11.3173C27.6849 12.7778 28 14.3373 28 15.996C28 17.6547 27.6853 19.2147 27.056 20.676C26.4267 22.1373 25.5716 23.408 24.4907 24.488C23.4098 25.568 22.1404 26.4236 20.6827 27.0547C19.2249 27.6858 17.6653 28.0009 16.004 28ZM16 26.6667C18.9778 26.6667 21.5 25.6333 23.5667 23.5667C25.6333 21.5 26.6667 18.9778 26.6667 16C26.6667 13.0222 25.6333 10.5 23.5667 8.43333C21.5 6.36667 18.9778 5.33333 16 5.33333C13.0222 5.33333 10.5 6.36667 8.43333 8.43333C6.36667 10.5 5.33333 13.0222 5.33333 16C5.33333 18.9778 6.36667 21.5 8.43333 23.5667C10.5 25.6333 13.0222 26.6667 16 26.6667Z"
                  fill="black"
                />
              </svg>
              {loading ? (
                <Spinner />
              ) : (
                <>
                  {confirmationStep === 1 && (
                    <>
                      <p className="title">
                        Are you sure you want to affix your stamp at the allocated positions?{" "}
                        <span>Please note that this cannot be undone?</span>
                      </p>
                      {/* Step 1 */}
                      <div className="buttons">
                        <button
                          className="cancel_btn"
                          onClick={() => {
                            // history.goBack();
                            // setActive(2);
                            hideConfirmationPopup();
                          }}
                        >
                          Cancel
                        </button>
                        <button className="proceed_btn" onClick={() => setConfirmationStep(2)}>
                          Proceed
                        </button>
                      </div>
                    </>
                  )}

                  {/* Step 2 */}
                  {confirmationStep === 2 && (
                    <>
                      <p className="title">
                        Are you sure you want to affix your stamp at the allocated positions?{" "}
                        <span>Please note that this cannot be undone?</span>
                      </p>
                      <div className={styles.passcode}>
                        <div className={styles.input_wrapper}>
                          <label htmlFor="password">Input Password</label>
                          <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                        <button
                          onClick={() => {
                            setLoading(true);
                            handleSetQRCode(password);
                          }}
                          disabled={!password}
                        >
                          <span>Continue</span>
                        </button>
                        {/* <PinVerification
                          setPin={setPin}
                          pin={pin}
                          handlePinComplete={async (completePin) => {
                            setLoading(true);
                            const passcode = completePin.map((num) => num.toString()).join("");
                            // setCompletePasscode(passcode);

                            // setConfirmationStep(3);
                            setPin(new Array(6).fill(""));
                            handleSetQRCode(passcode);
                          }}
                        /> */}
                      </div>
                      {error && <p className="error">{error}</p>}
                    </>
                  )}

                  {/* Success */}
                  {confirmationStep === 3 && (
                    <div className={styles.success}>
                      <img src="../../assets/success-check.png" alt="success check" />
                      <p>Stamp Affixed successfully!</p>
                      <p>You currently have {availableStamp} stamps left</p>
                      <div>
                        <button>View Stamped Document in PDF</button>
                        <button onClick={async () => await removePlaceholderImages()}>Clear Placeholders</button>
                      </div>
                    </div>
                  )}

                  {/* No Stamps */}
                  {confirmationStep === 4 && (
                    <div className={styles.no_stamps}>
                      <img src="../../assets/failed.png" alt="success check" />
                      <p>Ooops!</p>
                      <p>
                        {error ||
                          "You do not have any available stamp. Please click on the “Buy Stamp” button to purchase new stamps."}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          }
        />
      )}
    </>
  );
};

export default AffixSteps;
