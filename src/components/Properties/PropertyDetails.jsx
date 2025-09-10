import React from "react";

const PropertyDetails = ({ property }) => {
  if (!property) return null;

  return (
    <div className="border p-4 rounded mb-6 bg-gray-100">
      <h2 className="font-semibold">Property Details</h2>
      <p>
        <strong>Name:</strong> {property.name}
      </p>
      <p>
        <strong>Location:</strong> {property.location}
      </p>
    </div>
  );
};

export default PropertyDetails;
