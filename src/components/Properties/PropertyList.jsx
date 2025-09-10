import React from "react";

const PropertyList = ({ properties, onViewDetails }) => {
  return (
    <ul className="space-y-2 mb-6">
      {properties.map((prop) => (
        <li key={prop.id} className="border p-3 rounded flex justify-between">
          <span>
            {prop.name} - {prop.location}
          </span>
          <button
            className="text-blue-600 underline"
            onClick={() => onViewDetails(prop.id)}
          >
            View Details
          </button>
        </li>
      ))}
    </ul>
  );
};

export default PropertyList;
