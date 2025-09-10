import React from "react";

const PropertyForm = ({ newProperty, setNewProperty, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 border p-4 rounded">
      <h2 className="font-semibold">Add New Property</h2>
      <input
        type="text"
        placeholder="Property Name"
        className="border p-2 w-full rounded"
        value={newProperty.name}
        onChange={(e) =>
          setNewProperty({ ...newProperty, name: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Location"
        className="border p-2 w-full rounded"
        value={newProperty.location}
        onChange={(e) =>
          setNewProperty({ ...newProperty, location: e.target.value })
        }
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Create Property
      </button>
    </form>
  );
};

export default PropertyForm;
