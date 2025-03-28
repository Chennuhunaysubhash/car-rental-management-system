import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Import for navigation
import logoImage from "../assets/racing.png";
import accountImage from "../assets/profile-user.png";
import wishlistImage from "../assets/heart.png";
import cartImage from "../assets/shopping-cart.png";
import "../styles/renterDashboard.css";
import Catalog from "./Catalog"; // Import Catalog component
import RenterNotifications from "./RenterNotifications"; // Import RenterNotifications
import Wishlist from "./Wishlist"; 
import Cart from "./Cart";
import Profile from './Profile';
import RenterHistory from './RenterHistory';


const RenterDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate(); // Hook for redirection
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeView, setActiveView] = useState("Dashboard"); // Track active section
  const [hideWelcome, setHideWelcome] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    document.title = activeView === "Catalog" ? "Car Catalog 🚘" : "Renter Dashboard 🚗";

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeView]);

  const handleLogout = () => {
    console.log("🔴 Logging out...");

    logout();
    localStorage.removeItem("token"); // Clear token from localStorage
    setActiveView("Dashboard");
    setHideWelcome(true); // Hide welcome box

    navigate("/login");
  };

  // Function to handle menu item clicks
  const handleMenuClick = (view) => {
    setActiveView(view);
    setHideWelcome(true);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo" onClick={() => handleMenuClick("Dashboard")}>
          <img src={logoImage} alt="Logo" className="logo-image" />
          <span className="logo-title">Car Rental Management System</span>
        </div>

        <nav className="nav-links">
          <ul className="menu-list">
            <li onClick={() => handleMenuClick("Catalog")}>Catalog</li>
            <li onClick={() => handleMenuClick("Notifications")}>Notifications</li>
            <li onClick={() => handleMenuClick("History")}>History</li>
            <li onClick={() => handleMenuClick("Wishlist")}>
              <img src={wishlistImage} alt="Wishlist" className="menu-icon" />
            </li>
            <li onClick={() => handleMenuClick("Cart")}>
              <img src={cartImage} alt="Cart" className="menu-icon" />
            </li>
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
                  <li onClick={() => handleMenuClick("profile")}>Account Info</li>
                  <li onClick={() => handleMenuClick("Theme")}>Theme</li>
                  <li onClick={() => handleMenuClick("DeleteAccount")}>Delete account</li>
                  <li onClick={handleLogout}>Logout</li>
                </ul>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Hide the renter message when menu is clicked */}
      {!hideWelcome && <h3 className="renter-msg">Hi, {user?.name || "Renter"}!</h3>}

      <main className="dashboard-content">
        {activeView === "Catalog" && <Catalog />}
        {activeView === "Notifications" && <RenterNotifications />}
        {activeView === "Wishlist" && <Wishlist />}
        {activeView === "History" && <RenterHistory />}
        {activeView ==="Cart" && <Cart/>}
        {activeView === "profile" && <Profile />} 
        {activeView === "Dashboard" && !hideWelcome && (
          <div className="center-wrapper">
            <div className="welcome-box">
              <h2>Welcome to Car Rental Management System!</h2>
            </div>
            {/*<button className="browse-catalog-btn" onClick={() => handleMenuClick("Catalog")}>
              Browse Catalog
            </button>*/}
          </div>
        )}
      </main>
    </div>
  );
};

export default RenterDashboard;
