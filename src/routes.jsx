// routes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import VerificationStatus from "./pages/VerificationStatus";
import Favorites from "./pages/Favorites";
import Messages from "./pages/Messages";
import ListProperty from "./pages/ListProperty";
import AddProperty from "./pages/AddProperty";
import EditProperty from "./pages/EditProperty";
import PaymentPage from "./pages/PaymentPage";
import ProfileSettings from "./pages/ProfileSettings";
import Transactions from "./pages/Transactions";
import TransactionDetail from "./pages/TransactionDetail";
import LandlordProfile from "./pages/LandlordProfile";
import TenantProfile from "./pages/TenantProfile";
import ViewPropertyDetails from "./pages/ViewPropertyDetails";

import { useAuth } from "./context/AuthContext";

// ProtectedRoute component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // or a spinner

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Redirect logged-in users from login/home pages
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // or a spinner

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/verification" element={<ProtectedRoute><VerificationStatus /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/properties" element={<ProtectedRoute><ListProperty /></ProtectedRoute>} />
        <Route path="/profile/settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/transactions/:id" element={<ProtectedRoute><TransactionDetail /></ProtectedRoute>} />

        <Route path="/landlord/:id" element={<LandlordProfile />} />
        <Route path="/tenant/:id" element={<TenantProfile />} />
        <Route path="/property/:id" element={<ViewPropertyDetails />} />

        <Route path="/add-property" element={<ProtectedRoute requiredRole="landlord"><AddProperty /></ProtectedRoute>} />
        <Route path="/edit-property/:id" element={<ProtectedRoute requiredRole="landlord"><EditProperty /></ProtectedRoute>} />
        <Route path="/payment/:id" element={<ProtectedRoute requiredRole="tenant"><PaymentPage /></ProtectedRoute>} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
