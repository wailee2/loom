import React from "react";
import { useAuth } from "../context/AuthContext";
import LandlordDashboard from "../components/Dashboard/LandlordDashboard";
import TenantDashboard from "../components/Dashboard/TenantDashboard";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      {user?.user_type === "landlord" ? <LandlordDashboard /> : null}
      {user?.user_type === "tenant" ? <TenantDashboard /> : null}
    </div>
  );
};

export default Dashboard;
