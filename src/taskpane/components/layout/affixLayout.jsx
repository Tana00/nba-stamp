import * as React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@fluentui/react-components";
import AffixHeader from "../shared/AffixHeader";

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
    padding: "4px",
  },
  box: {
    margin: "4px auto",
    maxWidth: "504px",
  },
  container: {
    margin: "auto",
    padding: "6px 20px",
  },
});

const AffixLayout = ({ children }) => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <section className={styles.box}>
        <AffixHeader />
        <div className={styles.container}>{children}</div>
      </section>
    </div>
  );
};

AffixLayout.propTypes = {
  children: PropTypes.element,
};

export default AffixLayout;
