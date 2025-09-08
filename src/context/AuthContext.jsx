import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, logoutUser } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      if (response?.data?.token && response?.data?.user) {
        const { token, user: userData } = response.data;
        localStorage.setItem("access_token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        return userData;
      } else {
        throw new Error("Login failed: Invalid credentials");
      }
    } catch (err) {
      throw new Error(err.message || "Login failed");
    }
  };

  const logout = () => {
    logoutUser();
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
