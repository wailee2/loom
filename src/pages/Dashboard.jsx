import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ProfilePage from "./ProfilePage";
import LandlordsPage from "./LandlordsPage";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {user?.first_name || user?.email}
      </h1>

      <button
        className="px-4 py-2 bg-red-500 text-white rounded mb-6"
        onClick={logout}
      >
        Logout
      </button>

      <ProfilePage />
      <LandlordsPage />
    </div>
  );
};

export default Dashboard;
