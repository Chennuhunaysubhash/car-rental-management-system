import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom"; // ✅ Import useLocation
import "../../styles/registration.css";
import Header from "../common/Header";

const Registration = () => {
  const location = useLocation(); // ✅ Get URL parameters
  const navigate = useNavigate();

  // ✅ Extract role from URL query parameter (default to renter)
  const params = new URLSearchParams(location.search);
  const initialRole = params.get("role") === "owner" ? "owner" : "renter";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    userId: "",
    password: "",
    confirmPassword: "",
    role: initialRole, // ✅ Automatically set based on URL
  });

  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    setFormData((prev) => ({ ...prev, role: initialRole })); // ✅ Ensure role updates
  }, [initialRole]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "confirmPassword" || name === "password") {
      if (name === "confirmPassword" && value !== formData.password) {
        setPasswordError("Passwords do not match.");
      } else if (name === "password" && value !== formData.confirmPassword) {
        setPasswordError("Passwords do not match.");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
    setError("Please fill in all required fields.");
    return;
  }

  if (passwordError) {
    setError("Passwords do not match.");
    return;
  }

  console.log("Submitting Registration Data:", formData); // ✅ Debugging log

  try {
    await axios.post("http://localhost:5000/api/auth/register", formData);
    navigate("/login");
  } catch (error) {
    setError(error.response?.data?.message || "Registration failed.");
  }
};


  return (
    <>
      <Header />
      <h2 className="register-header">Register as {initialRole === "owner" ? "Owner" : "Renter"}</h2> {/* ✅ Show role */}
      <div className="registration-container">
        <h2> </h2>
        <form onSubmit={handleSubmit} className="registration-form">
  <label htmlFor="firstName">First Name<b>*</b></label>
  <input type="text" id="firstName" name="firstName" onChange={handleChange} required />

  <label htmlFor="lastName">Last Name</label>
  <input type="text" id="lastName" name="lastName" onChange={handleChange} required />

  <label htmlFor="email">Email<b>*</b></label>
  <input type="email" id="email" name="email" onChange={handleChange} required />

  <label htmlFor="phoneNumber">Phone Number<b>*</b></label>
  <input type="text" id="phoneNumber" name="phoneNumber" onChange={handleChange} />

  <label htmlFor="userId">User ID<b>*</b></label>
  <input type="text" id="userId" name="userId" onChange={handleChange} required />

  <label htmlFor="password">Password<b>*</b></label>
  <input type="password" id="password" name="password" onChange={handleChange} required />

  <label htmlFor="confirmPassword">Confirm Password<b>*</b></label>
  <input type="password" id="confirmPassword" name="confirmPassword" onChange={handleChange} required />

  {/* Real-time password mismatch error */}
  {passwordError && <p className="error">{passwordError}</p>}

  <button type="submit" disabled={passwordError}>Register</button>
</form>

        {error && <p className="error">{error}</p>}
        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    </>
  );
};

export default Registration;
