import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // redirect back to login
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Welcome to Your Dashboard!</h1>
      <p>This is a protected page accessible after login.</p>
      <button
        onClick={handleLogout}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
