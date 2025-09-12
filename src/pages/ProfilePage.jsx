import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { getMyProfile } from "../api/accounts";
import { useHandle404Redirect } from "../utils/handleErrors";
import HandleLoading from "../utils/HandleLoading";

const ProfilePage = () => {
  const { accessToken, logout, profile, setProfile } = useAuth();
  const [loading, setLoading] = useState(!profile);
  const handle404 = useHandle404Redirect();

  useEffect(() => {
    if (!profile && accessToken) {
      const fetchProfile = async () => {
        try {
          const data = await getMyProfile(accessToken);
          setProfile(data);
          localStorage.setItem("profile", JSON.stringify(data));
        } catch (err) {
          handle404(err);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [accessToken, handle404, profile, setProfile]);


  return (
    <HandleLoading loading={loading}>
      <div className="py-4 pr-4 md:pl-1.5 p-4 space-y-3 bg-white min-h-screen">
        <Header />
        <div className="og-bg og-p og-flex flex-col h-full ">
          <div>hey</div>
          <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow space-y-6">
        
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl font-bold">
                {profile?.first_name?.[0]}
                {profile?.last_name?.[0]}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
                <p className="text-gray-500 text-sm">Manage your account details</p>
              </div>
            </div>

            {profile ? (
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600 font-medium">Email</span>
                  <span className="text-gray-900">{profile.email}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600 font-medium">Name</span>
                  <span className="text-gray-900">
                    {profile.first_name} {profile.last_name}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600 font-medium">Phone</span>
                  <span className="text-gray-900">{profile.phone_number}</span>
                </div>
                <div className="border-b pb-2">
                  <span className="text-gray-600 font-medium block mb-1">Bio</span>
                  <p className="text-gray-800">{profile.bio || "No bio available"}</p>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 italic">No profile found.</p>
            )}

            <button
              onClick={logout}
              className="w-full py-2.5 rounded-xl bg-green-600 text-white font-semibold shadow hover:bg-green-700 active:scale-95 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </HandleLoading>

  );
};

export default ProfilePage;
