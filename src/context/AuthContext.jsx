import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, logoutUser } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if a user token exists
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const profileRes = await fetch(
            "https://greengrass-backend.onrender.com/api/accounts/profile/",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await profileRes.json();
          setUser(data.data || null);
        } catch {
          setUser(null);
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const userData = await loginUser(email, password);
      if (userData?.token) {
        localStorage.setItem("access_token", userData.token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      }
    } catch (err) {
      throw new Error(err.message || "Login failed");
    }
  };

  // Logout function
  const logout = () => {
    logoutUser(); // optional API logout
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

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
