import React from "react";
import "./header.css";
import logo from "../../assets/logo.svg";

const Header = () => {
  return (
    <div className="header">
      <div className="logo">
        <img src={logo} alt="" />
        <div className="logo-title">
          <p className="title">Sparrow Calendar</p>
          <p className="tag">Survey your days</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
