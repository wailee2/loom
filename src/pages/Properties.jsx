import React, { useEffect, useState } from "react";
import {
  getAllProperties,
  getPropertyById,
  createProperty,
} from "../api/property";
import { useAuth } from "../context/AuthContext";

import PropertyList from "../components/Properties/PropertyList";
import PropertyDetails from "../components/Properties/PropertyDetails";
import PropertyForm from "../components/Properties/PropertyForm";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [newProperty, setNewProperty] = useState({ name: "", location: "" });
  const { accessToken } = useAuth();

  // Fetch all properties
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllProperties();
        setProperties(data);
      } catch (err) {
        console.error("Error fetching properties:", err);
      }
    };
    fetchData();
  }, []);

  // Get single property details
  const handleViewDetails = async (id) => {
    try {
      const data = await getPropertyById(id);
      setSelectedProperty(data);
    } catch (err) {
      console.error("Error fetching property details:", err);
    }
  };

  // Create property (Landlord only)
  const handleCreateProperty = async (e) => {
    e.preventDefault();
    try {
      const data = await createProperty(newProperty, accessToken);
      setProperties((prev) => [...prev, data]);
      setNewProperty({ name: "", location: "" });
    } catch (err) {
      console.error("Error creating property:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Properties</h1>

      {/* List all properties */}
      <PropertyList properties={properties} onViewDetails={handleViewDetails} />

      {/* View selected property */}
      <PropertyDetails property={selectedProperty} />

      {/* Create new property (Landlord) */}
      {accessToken && (
        <PropertyForm
          newProperty={newProperty}
          setNewProperty={setNewProperty}
          onSubmit={handleCreateProperty}
        />
      )}
    </div>
  );
};

export default Properties;
