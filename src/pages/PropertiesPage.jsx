// src/pages/PropertiesPage.jsx
import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PropertyList from "../components/Properties/PropertyList";
import HandleLoading from "../utils/HandleLoading";

const PropertiesPage = () => {
  const { user, loading } = useAuth();
  

  const isLandlord = user?.role === "landlord";

  return (
    <HandleLoading loading={loading}>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-600">Properties</h1>
          <nav className="space-x-4">
            <Link
              to="/properties"
              className="text-gray-700 hover:text-green-600 transition"
            >
              All Properties
            </Link>
            {isLandlord && (
              <Link
                to="/properties/create"
                className="text-gray-700 hover:text-green-600 transition"
              >
                Add Property
              </Link>
            )}
          </nav>
        </header>
        
        {/* Main content */}
        <main className="p-6">
          <PropertyList />hey

          <Link
            to="/properties/create"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Create property
          </Link>

          
        </main>
      </div>
    </HandleLoading>
  );
};

export default PropertiesPage;
