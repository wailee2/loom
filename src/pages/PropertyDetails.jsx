// src/pages/PropertyDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPropertyById } from "../api/property";

const PropertyDetails = () => {
  const { propertyid } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPropertyById(propertyid);
        setProperty(data);
      } catch (error) {
        console.error("Error fetching property:", error.response || error);
        setError(error.message || "Failed to fetch property details");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [propertyid]);

  if (loading) return <p>Loading property details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!property) return <p>Property not found</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded-lg">
      hey
    </div>
  );
};

export default PropertyDetails;
