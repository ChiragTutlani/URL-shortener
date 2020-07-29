import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import Loader from "react-loader-spinner";
import axios from "axios";

import Navbar from "../../Components/Navbar/Navbar";
import Dashboard from "./routes/Dashboard/Dashboard";
import CreateURL from "./routes/CreateURL/CreateURL";
import Profile from "./routes/Profile/Profile";
import "./Home.css";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const onLogout = async () => {
    try {
      await axios({
        url: "/api/auth/logout",
        method: "get",
        headers: {
          Accept: "application/json",
        },
      });

      history.push("/");
    } catch (err) {
      history.push("/");
    }
  };

  async function getUserDetails() {
    try {
      await axios({
        url: "/api/user/me",
        method: "get",
        headers: {
          Accept: "application/json",
        },
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      history.push("/");
    }
  }

  useEffect(() => {
    getUserDetails();
  });

  if (loading) {
    return (
      <div className="home-container">
        <Navbar onLogout={onLogout} />
        <div className="home loader-container d-flex justify-content-center align-items-center flex-column">
          <Loader type="Rings" color="#253341" height={180} width={180} />
        </div>
      </div>
    );
  } else {
    return (
      <div className="home-container">
        <Navbar onLogout={onLogout} />
        <Router>
          <Switch>
            <Route path="/home" exact component={Dashboard} />
            <Route path="/home/create-url" exact component={CreateURL} />
            <Route path="/home/profile" exact component={Profile} />
          </Switch>
        </Router>
      </div>
    );
  }
};

export default Home;
