import React from "react";
import PropTypes from "prop-types";

const Stamp = ({ name, scn, number, validTill }) => {
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="95" stroke="black" strokeWidth="4" fill="none" />
      <text x="50%" y="15%" textAnchor="middle" fontSize="12" fontWeight="bold">
        NIGERIAN BAR ASSOCIATION
      </text>
      <circle cx="100" cy="100" r="40" fill="black" />
      <text x="50%" y="53%" textAnchor="middle" fontSize="20" fill="white" fontWeight="bold">
        NBA
      </text>
      <text x="50%" y="65%" textAnchor="middle" fontSize="10" fontWeight="bold">
        {name.toUpperCase()}
      </text>
      <text x="50%" y="72%" textAnchor="middle" fontSize="10">
        SCN No. {scn}
      </text>
      <text x="20%" y="90%" textAnchor="middle" fontSize="10">
        N<sup>o</sup>. {number}
      </text>
      <text x="80%" y="90%" textAnchor="middle" fontSize="10">
        Valid till {validTill}
      </text>
    </svg>
  );
};

Stamp.propTypes = {
  name: PropTypes.string,
  scn: PropTypes.string,
  number: PropTypes.string,
  validTill: PropTypes.string,
};

export default Stamp;
