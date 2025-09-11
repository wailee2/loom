// src/pages/Dashboard.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import { LucideSearch, MessageCircle, NotepadTextIcon } from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="py-4 pr-4 md:pl-1.5 p-4 space-y-3 bg-white">
      <Header user={user} />

      <main className="og-bg og-p">
        <h1 className="text-4xl font-semibold">Dashboard</h1>
      </main>

      

      <div className="flex gap-4 mb-6 flex-wrap">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          onClick={logout}
        >
          Logout
        </button>

        

        <Link
          to="/search"
          className="flex items-center px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
        >
          <LucideSearch className="w-5 h-5 mr-2" />
          Search Users
        </Link>

        <Link to="/landlords" className="flex items-center px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition">
          View Landlords
        </Link>
        <Link 
          to="/properties" 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          properties
        </Link>
        
        
      </div>

      
    </div>
  );
};

export default Dashboard;
