import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import Loader from "react-loader-spinner";
import "./Login.css";
import HorizontalOR from "../../Components/HorizontalOR/HorizontalOR";

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const history = useHistory();

  useEffect(() => {
    async function checkCookie() {
      try {
        await axios({
          url: "/api/user/me",
          method: "get",
          headers: {
            Accept: "application/json",
          },
        });
        setLoadingUser(false);
        history.push("/home");
      } catch (err) {
        setLoadingUser(false);
      }
    }
    checkCookie();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email === "" && password === "") {
      setInfo("Email and Password are required");
      return;
    }
    if (email === "") {
      setInfo("Email is required");
      return;
    }
    if (password === "") {
      setInfo("Password is required");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setInfo("Invalid email");
      return;
    }
    setInfo("");
    setLoading(true);

    try {
      await axios({
        url: "/api/auth/login",
        method: "post",
        headers: {
          Accept: "application/json",
        },
        data: {
          email: email,
          password: password,
        },
      });

      setLoading(false);
      history.push("/home");
    } catch (error) {
      setInfo(error.response.data.error);
      setLoading(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="login loader-container d-flex justify-content-center align-items-center flex-column">
        <h1>Welcome to URL Shortener</h1>
        <Loader type="Rings" color="#5FC5C7" height={180} width={180} />
      </div>
    );
  } else {
    return (
      <div className="home d-flex justify-content-center align-items-center">
        <div className="login-container pt-4 pb-4 pl-3 pr-3">
          <h1 className="text-center">URL Shortener</h1>
          <form>
            <div className="form-group">
              <label htmlFor="inputEmail">
                Email Address<span className="required-symbol"> *</span>
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="form-control"
                id="inputEmail"
                value={email}
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="inputPassword">
                Password<span className="required-symbol"> *</span>
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="form-control"
                id="inputPassword"
                value={password}
                placeholder="Enter your password"
              />
            </div>
            {loading ? (
              <Loader
                className="text-center"
                type="Rings"
                color="#00BFFF"
                height={60}
                width={60}
              />
            ) : (
              <p className="text-center alert-danger">{info}</p>
            )}
            <button
              onClick={(e) => handleSubmit(e)}
              type="submit"
              className="btn btn-primary d-block mx-auto"
            >
              Log In
            </button>
          </form>
          <HorizontalOR />
          <button className="btn btn-info d-block mx-auto">
            <Link className="link white-text" to="/signup">
              Go to Sign Up
            </Link>
          </button>
        </div>
      </div>
    );
  }
};

export default Home;
