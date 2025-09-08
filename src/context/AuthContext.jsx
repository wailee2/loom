import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, logoutUser } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, try to load user from localStorage
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password);

      // Assuming API returns { data: { token, user } }
      const { token, user: userData } = response.data;

      if (!token || !userData) {
        throw new Error("Invalid login response");
      }

      // Save to localStorage
      localStorage.setItem("access_token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Update state
      setUser(userData);

      return userData;
    } catch (err) {
      throw new Error(err.message || "Login failed");
    }
  };

  const logout = () => {
    logoutUser(); // optional API call
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
