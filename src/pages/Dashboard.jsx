import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

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
        className="px-4 py-2 bg-green-500 text-white rounded mb-6"
        onClick={logout}
      >
        Logout
      </button>

      {/* Link to Profile Page */}
      <Link
        to="/profile"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Go to Profile
      </Link>
    </div>
  );
};

export default Dashboard;
