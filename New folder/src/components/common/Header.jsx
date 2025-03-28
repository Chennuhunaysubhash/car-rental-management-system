import React from "react";
import "../common/header.css";
import logo from "../../assets/racing.png"; // Update the path as per your project

function Header() {
  return (
    <div className="header">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
        <span className="web-name">Car rental management system</span>
      </div>
    </div>
  );
}

export default Header;
