// src/api/accounts.js
const BASE_URL = "https://greengrass-backend.onrender.com/api/accounts";

export const getProfile = async (accessToken) => {
  try {
    const res = await fetch(`${BASE_URL}/profile/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Profile fetch error:", err);
    return null;
  }
};

export const getProfileByUsername = async (username, accessToken) => {
  try {
    const res = await fetch(`${BASE_URL}/profile/${username}/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return await res.json();
  } catch (err) {
    console.error("Profile fetch by username error:", err);
    return null;
  }
};

export const getLandlords = async () => {
  try {
    const res = await fetch(`${BASE_URL}/landlords/`);
    return await res.json();
  } catch (err) {
    console.error("Landlord list fetch error:", err);
    return [];
  }
};
