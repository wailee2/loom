// src/pages/Dashboard.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Welcome, {user?.first_name}</h1>
      <p>User type: {user?.user_type}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
