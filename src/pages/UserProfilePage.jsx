import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfileByUsername } from "../api/accounts";

const UserProfilePage = () => {
  const { username } = useParams();
  const { accessToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfileByUsername(username, accessToken);
        setProfile(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) fetchProfile();
  }, [username, accessToken]);

  if (loading) return <p>Loading user profile...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!profile) return <p>User not found.</p>;

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-2">
        {profile.first_name} {profile.last_name}'s Profile
      </h2>
      <p>Email: {profile.email}</p>
      <p>Phone: {profile.phone_number}</p>
      <p>Bio: {profile.bio}</p>
      <p>Joined: {new Date(profile.date_joined).toLocaleDateString()}</p>
      <p>User Type: {profile.user_type}</p>
      {profile.user_type === "landlord" && (
        <>
          <p>Property Name: {profile.property_name}</p>
          <p>Years of Experience: {profile.years_experience}</p>
        </>
      )}
    </div>
  );
};

export default UserProfilePage;
