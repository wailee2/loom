import React, { useEffect, useState } from "react";
import { getLandlords } from "../api/accounts";

const LandlordsPage = ({ children }) => {
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

  if (children) return children(landlords);

  if (!landlords.length) return <p>No landlords found.</p>;

  return (
    <ul className="list-disc pl-5">
      {landlords.map((landlord) => (
        <li key={landlord.id}>
          {landlord.first_name} {landlord.last_name}
        </li>
      ))}
    </ul>
  );
};

export default LandlordsPage;
