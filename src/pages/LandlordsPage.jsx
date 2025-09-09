import React, { useEffect, useState } from "react";
import { getLandlords } from "../api/accounts";

const LandlordsPage = () => {
  const [landlords, setLandlords] = useState([]);

  useEffect(() => {
    const fetchLandlords = async () => {
      try {
        const data = await getLandlords();
        setLandlords(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLandlords();
  }, []);

  if (!landlords.length) return <p>No landlords found.</p>;

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Landlords</h2>
      <ul className="list-disc pl-5">
        {landlords.map((landlord) => (
          <li key={landlord.id}>
            {landlord.first_name} {landlord.last_name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LandlordsPage;
