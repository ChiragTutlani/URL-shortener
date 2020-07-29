import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Loader from "react-loader-spinner";
import axios from "axios";
import HorizontalOR from "../../Components/HorizontalOR/HorizontalOR";
import "./Signup.css";

const Signup = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missing = [];
    if (fullname === "") missing.push("Fullname");
    if (email === "") missing.push("Email");
    if (password === "" || password2 === "") missing.push("Password");
    if (missing.length > 0) {
      let message = "";
      missing.forEach((item, i) => {
        if (i === 0) message = message + item;
        else if (i === missing.length - 1) message = message + " and " + item;
        else message = message + ", " + item;
      });
      const str = missing.length > 1 ? " are" : " is";
      message = message + str + " required";
      setInfo(message);
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setInfo("Invalid email");
      return;
    }
    if (password !== password2) {
      setInfo("Passwords do not match");
      return;
    }

    setInfo("");
    setLoading(true);

    try {
      await axios({
        url: "/api/user",
        method: "post",
        headers: {
          Accept: "application/json",
        },
        data: {
          fullname,
          email,
          password,
          password2,
        },
      });

      setLoading(false);
      history.push("/home");
    } catch (error) {
      if (error.response.status === 400 || error.response.status === 500) {
        setInfo(error.response.data.error);
      } else setInfo("Some problem occurred. Try again later");

      setLoading(false);
    }
  };

  return (
    <div className="signup d-flex justify-content-center align-items-center">
      <div className="signup-container pt-4 pb-4 pl-3 pr-3">
        <h1 className="text-center">Sign Up</h1>
        <form>
          <div className="form-group">
            <label htmlFor="inputFullname">
              Fullname<span className="required-symbol"> *</span>
            </label>
            <input
              onChange={(e) => setFullname(e.target.value)}
              className="form-control"
              id="inputFullname"
              value={fullname}
              placeholder="Enter your fullname"
              required={true}
            />
          </div>
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
              required={true}
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
              required={true}
            />
          </div>
          <div className="form-group">
            <label htmlFor="inputPassword2">
              Confirm Password<span className="required-symbol"> *</span>
            </label>
            <input
              onChange={(e) => setPassword2(e.target.value)}
              type="password"
              className="form-control"
              id="inputPassword2"
              value={password2}
              placeholder="Confirm your password"
              required={true}
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
            Sign Up
          </button>
        </form>
        <HorizontalOR />
        <button className="btn btn-primary d-block mx-auto">
          <Link className="link white-text" to="/">
            Go to Log In
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Signup;
