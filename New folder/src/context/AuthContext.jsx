import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

// ✅ Export the `useAuth` hook to access AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);

  const login = (userData) => {
    setUser(userData); // Save user data (name, role, token)
    localStorage.setItem("user", JSON.stringify(userData)); // Store user in localStorage
    localStorage.setItem("token", userData.token); // Store token (if any)
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  useEffect(() => {
    document.title = "Car Rental 🚗";
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
