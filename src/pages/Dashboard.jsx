import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getMyProfile, getLandlords } from "../api/accounts";

const Dashboard = () => {
  const { user, accessToken, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [landlords, setLandlords] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login"); // redirect to login if not logged in
    } else {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const profileData = await getMyProfile(accessToken);
      setProfile(profileData);

      const landlordsData = await getLandlords();
      setLandlords(landlordsData);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.first_name || user?.email}</h1>
      <button
        className="px-4 py-2 bg-red-500 text-white rounded mb-4"
        onClick={logout}
      >
        Logout
      </button>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Your Profile</h2>
        {profile ? (
          <div>
            <p>Email: {profile.email}</p>
            <p>Name: {profile.first_name} {profile.last_name}</p>
            <p>Phone: {profile.phone_number}</p>
            <p>Bio: {profile.bio}</p>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold">Landlords</h2>
        {landlords.length > 0 ? (
          <ul>
            {landlords.map((landlord) => (
              <li key={landlord.id}>{landlord.first_name} {landlord.last_name}</li>
            ))}
          </ul>
        ) : (
          <p>No landlords found.</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
