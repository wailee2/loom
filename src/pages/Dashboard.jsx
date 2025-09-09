import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
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
        className="px-4 py-2 bg-green-500 text-white rounded mb-6"
        onClick={logout}
      >
        Logout
      </button>

      {/* Profile section */}
      <ProfilePage />

      {/* Landlords section with clickable links */}
      <div className="p-4 border rounded shadow mt-6">
        <h2 className="text-xl font-semibold mb-2">Landlords</h2>
        <LandlordsPage>
          {(landlords) => (
            <ul className="list-disc pl-5">
              {landlords.map((landlord) => (
                <li key={landlord.id}>
                  <Link
                    className="text-blue-600 hover:underline"
                    to={`/profile/${landlord.username}`}
                  >
                    {landlord.first_name} {landlord.last_name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </LandlordsPage>
      </div>
    </div>
  );
};

export default Dashboard;
