import React, { useRef } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  box: {
    margin: "20px auto",
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
  },
  input: {
    width: "51px",
    height: "65px",
    fontSize: "14px",
    fontWeight: 500,
    fontFamily: "'Poppins', sans-serif",
    textAlign: "center",
    border: "none",
    borderRadius: "2.54px",
    backgroundColor: "#EEEEEE",
    color: "#000000",
    "&:last-child": {
      marginRight: 0,
    },
  },
});

const PinVerification = (props) => {
  const { pin, setPin } = props;
  const classes = useStyles();
  const history = useHistory();
  const inputRefs = useRef([]);

  const handlePinComplete = () => {
    history.push("/loader");
  };

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value) || value === "") {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      // Check if pin entry is complete
      if (index === 5 && newPin.every((digit) => digit !== "")) {
        handlePinComplete();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.box}>
        {pin.map((value, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            className={classes.input}
            type="text"
            maxLength={1}
            value={value}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        ))}
      </div>
    </div>
  );
};

PinVerification.propTypes = {
  pin: PropTypes.array,
  setPin: PropTypes.func,
};

export default PinVerification;
