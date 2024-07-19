import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@fluentui/react-components";
import { getDashboardData } from "../api";

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
    margin: "10px",
  },
  container: {
    width: "100%",
    maxWidth: "427px",
    margin: "6px auto",
    backgroundColor: "transparent",
    padding: "6px 0",
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
  },
});

const Dashboard = () => {
  const history = useHistory();
  const styles = useStyles();

  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data?.data);
      } catch (error) {
        setError("Failed to fetch dashboard data");
        history.goBack();
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!dashboardData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.root}>
      <div className={styles.box}>
        <div className={styles.container}>
          <p className={styles.text}>Welcome Back, Taiwo</p>

          <div>
            <p className={styles.title}>NBA Stamp & Seal</p>
            <div className={styles.wrapper}>
              <p className="text">Stamp and seal Wallet</p>
              <div className={styles.inner_box}>
                <div>
                  <img src="../../../assets/stampWallet.png" alt="stamps" className={styles.image} />
                  <p className="stamp_count">{dashboardData?.totalNoOfStampPurchased} Stamps</p>
                </div>
                <div className={styles.button_wrapper}>
                  <button className={styles.button} onClick={() => history.push("buy-stamp")}>
                    Buy Stamp
                  </button>
                  <button className={styles.button} onClick={() => history.push("affix-stamp")}>
                    Affix Stamp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
