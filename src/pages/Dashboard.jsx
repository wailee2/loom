// src/pages/Dashboard.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { LucideSearch, MessageCircle, NotepadTextIcon, PersonStanding } from "lucide-react";
import { getProfileByUsername } from "../api/accounts";
import { useHandle404Redirect } from "../utils/handleErrors";

const Dashboard = () => {
  const { user, logout, accessToken } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const handle404 = useHandle404Redirect();

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;

    try {
      // Check if user exists
      await getProfileByUsername(searchQuery, accessToken);
      // Navigate to profile if exists
      navigate(`/profile/${searchQuery}`);
    } catch (err) {
      handle404(err);
    } finally {
      setSearchQuery("");
    }
  };


  return (
    <div className="py-4 pr-4 pl-1.5 space-y-3 bg-white">
      <header className="og-bg p-4 flex-wrap ">
        {/*SEARCHBAR */}
        <div>
          <form onSubmit={handleSearch} className="flex max-w-[20rem] px-4 rounded-full bg-white   ">
            <div
              className="  text-gray-900 rounded-r-md   flex items-center"
            >
              <LucideSearch className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search by username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 py-3.5 px-3  bg-white  text-sm focus:outline-none"
            /> 
          </form>
        </div>

        <div className="flex justify-between items-center gap-3">
          <Link 
            to="/messages" 
            className="p-3.5 bg-white rounded-full "
          >
            <MessageCircle className="w-5 h-5 text-gray-900" />
          </Link>
          <div className="p-3.5 bg-white rounded-full">
            <NotepadTextIcon className="w-5 h-5 text-gray-900" />
          </div>
          <Link
            to="/profile"
            className="flex items-center justify-between group gap-3"
          >
            <div className="bg-white rounded-full p-6.5 group-hover:bg-gray-900 transition-all duration-800 linear"></div>
            <div className="flex flex-col items-start">
              <span className="text-[19px] font-semibold">
                {user?.first_name}
              </span>
              <span className="text-sm text-gray-500">
                {user?.email}
              </span>
            </div>
          </Link>
          
        </div>
      </header>

      <main className="og-bg p-4">
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
