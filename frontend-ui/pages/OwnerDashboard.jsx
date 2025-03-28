import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/racing.png";
import accountImage from "../assets/profile-user.png";
import CarComponent from "./CarComponent";
import PendingRequests from "./PendingRequests"; // Importing PendingRequests component
import Notifications from "./OwnerNotifications";
import History from './OwnerHistory';
import Profile from './Profile';
import "../styles/ownerDashboard.css";

const OwnerDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("welcome");
  const dropdownRef = useRef(null);

  useEffect(() => {
    document.title = "Owner Dashboard 🚗";

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo">
          <img src={logoImage} alt="Logo" className="logo-image" />
          <span className="logo-title1">Car Rental Management System</span>
        </div>

        <nav className="nav-links1">
          <ul className="menu-list1">
            <li onClick={() => setActiveSection("manageCars")}>Manage Cars</li>
            <li onClick={() => setActiveSection("notifications")}>Notifications</li>
            <li onClick={() => setActiveSection("pendingRequests")}>Requests</li> {/* New menu item */}
            <li onClick={() => setActiveSection("history")}>History</li>
          </ul>

          <div className="account-container" ref={dropdownRef}>
            <img
              src={accountImage}
              alt="Account"
              className="account-icon"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div className="dropdown-menu">
                <ul className="dropdown-list">
                  <li onClick={() => setActiveSection("profile")}>Account Info</li>
                  <li onClick={() => navigate("/theme")}>Theme</li>
                  <li onClick={() => navigate("/delete-account")}>Delete Account</li>
                  <li onClick={handleLogout}>Logout</li>
                </ul>
              </div>
            )}
          </div>
        </nav>
      </header>

      {activeSection === "welcome" && (
        <>
          <h3 className="owner-msg">Hi, {user?.name || "Owner"}!</h3>
          <main className="dashboard-content">
            <div className="center-wrapper">
              <div className="welcome-box">
                <h2>Welcome to Car Rental Management System!</h2>
              </div>
              <button className="manage-cars-btn" onClick={() => setActiveSection("manageCars")}>
                Manage Cars
              </button>
            </div>
          </main>
        </>
      )}

      {activeSection === "manageCars" && <CarComponent />}
      {activeSection === "pendingRequests" && <PendingRequests />} {/* Rendering new component */}
      {activeSection === "notifications" && <Notifications />} 
      {activeSection === "history" && <History />} 
      {activeSection === "profile" && <Profile />} 
    </div>
  );
};

export default OwnerDashboard;
