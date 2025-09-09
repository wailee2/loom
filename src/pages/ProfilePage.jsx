import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyProfile } from "../api/accounts";

const ProfilePage = () => {
  const { accessToken } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile(accessToken);
        setProfile(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (accessToken) fetchProfile();
  }, [accessToken]);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="p-4 border rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-2">My Profile</h2>
      <p>Email: {profile.email}</p>
      <p>Name: {profile.first_name} {profile.last_name}</p>
      <p>Phone: {profile.phone_number}</p>
      <p>Bio: {profile.bio}</p>
    </div>
  );
};

export default ProfilePage;
