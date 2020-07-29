import React from "react";
import "./Navbar.css";

const Navbar = ({ onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg">
      <a className="navbar-brand" href="/home">
        URL Shortener
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarContent">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a className="nav-link" href="/home">
              My URLs
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/home/create-url">
              Create URL
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/home/profile">
              My Profile
            </a>
          </li>
          <li className="nav-item">
            <button className="btn" onClick={() => onLogout()}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
