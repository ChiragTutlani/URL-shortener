import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "react-loader-spinner";
import "./Dashboard.css";
import URLBox from "../../../../Components/URLBox/URLBox";

const Dashboard = () => {
  const [user, setUser] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);

  async function getUserDetails() {
    try {
      const res = await axios({
        url: "/api/user/me",
        method: "get",
        headers: {
          Accept: "application/json",
        },
      });
      setUser(res.data.data.urlId);
      setLoadingUser(false);
    } catch (err) {
      setLoadingUser(false);
    }
  }

  useEffect(() => {
    getUserDetails();
  }, []);

  const refresh = () => {
    getUserDetails();
  };

  if (loadingUser) {
    return (
      <div className="dashboard loader-container d-flex justify-content-center align-items-center flex-column">
        <Loader type="Rings" color="#253341" height={180} width={180} />
      </div>
    );
  } else {
    return (
      <div className="dashboard content-container">
        <div className="container-lg">
          {user.length === 0 ? (
            <h3 className="text-center mt-3">You don't have any short URLs</h3>
          ) : null}
          {user.map((d, i) => (
            <URLBox key={i} refresh={refresh} {...d} />
          ))}
        </div>
      </div>
    );
  }
};

export default Dashboard;
