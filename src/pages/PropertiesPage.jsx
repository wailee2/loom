// src/pages/PropertiesPage.jsx
import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PropertyList from "../components/Properties/PropertyList";
import CreateProperty from "../components/Properties/CreateProperty";
import PropertyDetails from "../components/Properties/PropertyDetails";
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
          <Routes>
            {/* Property list */}
            <Route
              path="/"
              element={
                <div className="space-y-6">
                  <PropertyList />
                </div>
              }
            />

            {/* Property create - landlord only */}
            <Route
              path="create"
              element={
                isLandlord ? (
                  <div className="space-y-6">
                    <CreateProperty />
                  </div>
                ) : (
                  <Navigate to="/properties" />
                )
              }
            />

            {/* Property details */}
            <Route
              path=":id"
              element={
                <div className="space-y-6">
                  <PropertyDetails />
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </HandleLoading>
  );
};

export default PropertiesPage;
