// src/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import UserProfile from "./pages/UserProfile";
import Search from "./pages/Search";
import PageNotFound from "./pages/PageNotFound";
import Landlords from "./pages/Landlords";
import PropertiesPage from "./pages/PropertiesPage"
import PropertyDetailPage from "./pages/PropertyDetailPage";
import CreateProperty from "./pages/CreateProperty";
import RoomsPage from "./pages/RoomsPage";
import AddRoom from "./pages/AddRoom";
import ErrorBoundary from "./components/ErrorBoundary";
import Messages from "./pages/Messages";
import Sidebar from "./components/Sidebar";
import { useAuth } from "./context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};


const AppRoutes = () => {
  const location = useLocation();

  // Pages where sidebar should NOT be shown
  const noSidebarPages = ["/", "/login", "/register"];

  const showSidebar = !noSidebarPages.includes(location.pathname);
  return (
    <ErrorBoundary>
      <div className="flex">
        {showSidebar && <Sidebar />}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/:username"
              element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/search"
              element={
                <PrivateRoute>
                  <Search />
                </PrivateRoute>
              }
            />
            <Route
              path="/landlords"
              element={
                <PrivateRoute>
                  <Landlords />
                </PrivateRoute>
              }
            />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/properties/:id" element={<PropertyDetailPage />} />
            <Route
              path="/properties/create"
              element={
                <PrivateRoute>
                  <CreateProperty />
                </PrivateRoute>
              }
            />

            <Route path="/rooms/:propertyid" element={<RoomsPage />} />

            <Route
              path="/rooms/:property_id/add-room"
              element={
                <PrivateRoute>
                  <AddRoom />
                </PrivateRoute>
              }
            />
            
            <Route path="/messages" element={<Messages />} />

            <Route path="/page-not-found" element={<PageNotFound />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default AppRoutes;
