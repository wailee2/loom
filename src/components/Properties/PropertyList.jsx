// components/Properties/PropertyList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProperties } from "../../api/property";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getAllProperties();
        setProperties(data);
      } catch (err) {
        setError(err.message || "Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) return <p>Loading properties...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {properties.length === 0 ? (
        <p>No propertiesPLIST available.</p>
      ) : (
        properties.map((property) => (
          <div
            key={property.id}
            className="border property-card rounded-lg p-4 shadow hover:shadow-lg transition"
          >plist
            <h2 className="text-xl font-semibold mb-2">{property.title}</h2>
            <p className="text-gray-600 mb-1">Location: {property.location}</p>
            <p className="text-gray-600 mb-1">Price: ${property.price}</p>
            <p className="text-gray-600 mb-1">status: {property.status}</p>
            <p className="text-gray-500 text-sm">property_type: {property.property_type}</p>
            <p className="text-gray-500 text-sm">rental_type: {property.rental_type}</p>
            <p className="text-gray-500 text-sm">bedrooms: {property.bedrooms}</p>
            <p className="text-gray-500 text-sm">bathrooms {property.bathrooms}</p>
            <p className="text-gray-500 text-sm">created at {property.created_at}</p>
            

            <Link
              to={`/rooms/${property.id}`} // link to rooms page from plist
              className="mt-auto inline-block bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              View Room this room
            </Link>
            <Link
              to={`/properties/${property.id}`} // ✅ dynamic route
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Property Details
            </Link>

          </div>
        ))
      )}
    </div>
  );
};

export default PropertyList;
