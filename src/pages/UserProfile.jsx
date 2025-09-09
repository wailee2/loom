// src/pages/UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfileByUsername } from "../api/accounts";

const UserProfile = () => {
  const { username } = useParams();
  const { accessToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfileByUsername(username, accessToken);
        setProfile(data);
      } catch (err) {
        if (err.status === 404) {
          // Redirect to 404 page
          navigate("/page-not-found");
        } else {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) fetchProfile();
  }, [username, accessToken, navigate]);

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return null; // Already redirected if 404

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">{profile.full_name || profile.username}</h1>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      {profile.phone && <p><strong>Phone:</strong> {profile.phone}</p>}
      {profile.bio && <p><strong>Bio:</strong> {profile.bio}</p>}
    </div>
  );
};

export default UserProfile;
