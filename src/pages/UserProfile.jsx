// src/pages/UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // assuming you have AuthContext
import { getProfileByUsername } from "../api/profile"; // your API functions

const UserProfile = () => {
  const { username } = useParams(); // get username from URL
  const { accessToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfileByUsername(username, accessToken);
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, accessToken]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!profile) return <p>No profile found.</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">{profile.full_name || profile.username}</h1>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      {profile.phone && <p><strong>Phone:</strong> {profile.phone}</p>}
      {profile.bio && <p><strong>Bio:</strong> {profile.bio}</p>}
      {/* Add more fields as needed */}
    </div>
  );
};

export default UserProfile;
