import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/login.css";
import Header from "../common/Header";

const Login = () => {
  const [formData, setFormData] = useState({ userId: "", password: "" });
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("owner"); // "owner" or "renter"
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  /*useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);*/
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userId || !formData.password) {
      setError("Please enter both Email/User ID and Password.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        ...formData,
        role: activeTab, // Send "owner" or "renter" as role
      });

      const { token, name, role } = response.data;

      // ✅ Check if role matches the selected tab
      if (role !== activeTab) {
        setError(`You are not authorized to log in as a ${activeTab}.`);
        return;
      }

      // ✅ Save user data and navigate
      login({ token, name, role });
      navigate(role === "owner" ? "/owner-dashboard" : "/renter-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <>
      <Header/>

      <div className="login-container">
        <h2>Login</h2>
        <div className="login-tabs">
          <button
            className={activeTab === "owner" ? "active" : ""}
            onClick={() => setActiveTab("owner")}
          >
            Owner login
          </button>
          <button
            className={activeTab === "renter" ? "active" : ""}
            onClick={() => setActiveTab("renter")}
          >
            Renter login
          </button>
        </div>

        <div className="login-box">
          <form onSubmit={handleSubmit} className="login-form">
            <label>Email/User ID<b>*</b></label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
            />

            <label>Password<b>*</b></label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <div className="forgot-password">
              <a href="/forgot-password">Forgot Password</a>
            </div>

            <button type="submit" className="login-button">Login</button>
          </form>

          {error && <p className="error">{error}</p>}

          <p>
            Don't have an account?{" "}
            <a href={`/register?role=${activeTab}`}>
              Register here
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
