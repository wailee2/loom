import React, { useEffect, useState } from "react";
import { getLandlords } from "../../api/accounts";

const LandlordDashboard = () => {
  const [landlords, setLandlords] = useState([]);

  useEffect(() => {
    getLandlords().then(setLandlords);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Landlord Dashboard</h1>
      <h2 className="font-semibold mb-2">All Landlords:</h2>
      <ul className="list-disc pl-5">
        {landlords.map((landlord) => (
          <li key={landlord.id}>{landlord.first_name} {landlord.last_name}</li>
        ))}
      </ul>
    </div>
  );
};

export default LandlordDashboard;
