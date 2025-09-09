// src/pages/Dashboard.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, useNavigate as useRouterNavigate } from "react-router-dom";
import { LucideSearch } from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    // Navigate to /profile/:username dynamically
    navigate(`/profile/${searchQuery}`);
    setSearchQuery("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {user?.first_name || user?.email}
      </h1>

      <div className="flex gap-4 mb-6 flex-wrap">
        {/* Logout Button */}
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
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

        {/* Link to Search Page */}
        <Link
          to="/search"
          className="flex items-center px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
        >
          <LucideSearch className="w-5 h-5 mr-2" />
          Search Users
        </Link>
      </div>

      {/* Inline Quick Search */}
      <form onSubmit={handleSearch} className="flex max-w-md mb-4">
        <input
          type="text"
          placeholder="Search by username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gray-700 text-white rounded-r-md hover:bg-gray-800 flex items-center"
        >
          <LucideSearch className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default Dashboard;
