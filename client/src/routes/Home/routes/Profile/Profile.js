import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState({});
  const [error, setError] = useState("");

  async function getUserDetails() {
    try {
      const res = await axios({
        url: "/api/user/me",
        method: "get",
        headers: {
          Accept: "application/json",
        },
      });
      setUser(res.data.data);
      setError("");
    } catch (err) {
      setError("Some problem occurred. Please refresh the page.");
      setUser({});
    }
  }

  useEffect(() => {
    getUserDetails();
  });

  if (error !== "") {
    return (
      <div className="profile-container container-lg d-flex justify-content-center align-items-center">
        <h3>{error}</h3>
      </div>
    );
  } else {
    return (
      <div className="profile-container container-lg">
        <div className="row">
          <p className="col-4 text-center">Fullname: </p>
          <p className="col-8 text-center">{user.fullname}</p>
        </div>
        <div className="row">
          <p className="col-4 text-center">Email: </p>
          <p className="col-8 text-center">{user.email}</p>
        </div>
        <div className="row">
          <p className="col-4 text-center">Joined: </p>
          <p className="col-8 text-center">{user.createdAt}</p>
        </div>
      </div>
    );
  }
};

export default Profile;
