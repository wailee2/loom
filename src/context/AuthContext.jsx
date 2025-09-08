import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, logoutUser } from "./auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On app load, try fetching profile if token exists
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
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const userData = await loginUser(email, password);
    setUser(userData);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
