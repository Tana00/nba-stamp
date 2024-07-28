import * as React from "react";
import PropTypes from "prop-types";
import { DatePicker, mergeStyleSets, defaultDatePickerStrings } from "@fluentui/react";

const styles = mergeStyleSets({
  root: { selectors: { "> *": { marginBottom: 15 } } },
  control: {
    marginBottom: 15,
    width: "100%",
    "& .fieldGroup-115": {
      width: "100%",
      height: "100%",
    },
    "& .icon-125": {
      display: "none",
    },
  },
});

const onFormatDate = (date) => {
  return !date ? "" : date.getDate() + "/" + (date.getMonth() + 1) + "/" + (date.getFullYear() % 100);
};

export const CustomDatePicker = ({ value, setValue }) => {
  const datePickerRef = React.useRef(null);

  const onParseDateFromString = React.useCallback(
    (newValue) => {
      const previousValue = value || new Date();
      const newValueParts = (newValue || "").trim().split("/");
      const day =
        newValueParts.length > 0 ? Math.max(1, Math.min(31, parseInt(newValueParts[0], 10))) : previousValue.getDate();
      const month =
        newValueParts.length > 1
          ? Math.max(1, Math.min(12, parseInt(newValueParts[1], 10))) - 1
          : previousValue.getMonth();
      let year = newValueParts.length > 2 ? parseInt(newValueParts[2], 10) : previousValue.getFullYear();
      if (year < 100) {
        year += previousValue.getFullYear() - (previousValue.getFullYear() % 100);
      }
      return new Date(year, month, day);
    },
    [value]
  );

  return (
    <DatePicker
      componentRef={datePickerRef}
      label=""
      allowTextInput
      ariaLabel="Select a date"
      value={value}
      onSelectDate={setValue}
      formatDate={onFormatDate}
      parseDateFromString={onParseDateFromString}
      className={styles.control}
      borderless
      // DatePicker uses English strings by default. For localized apps, you must override this prop.
      strings={defaultDatePickerStrings}
      placeholder="DD/MM/YYYY"
    />

    //   <div>Selected date: {(value || "").toString()}</div>
  );
};

CustomDatePicker.propTypes = {
  value: PropTypes.string,
  setValue: PropTypes.func,
};
