// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    user_type: "tenant", // default
    // nested fields
    tenant: {
      date_of_birth: "",
      bio: "",
    },
    landlord: {
      phone_number: "",
      property_name: "",
      years_experience: "",
      website: "",
      bio: "",
      location: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // handle general form input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // handle nested tenant/landlord fields
    if (name.startsWith("tenant.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        tenant: { ...prev.tenant, [key]: value },
      }));
    } else if (name.startsWith("landlord.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        landlord: { ...prev.landlord, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // handle register submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // pick correct payload
    let payload = {
      email: formData.email,
      password: formData.password,
      password2: formData.password2,
      first_name: formData.first_name,
      last_name: formData.last_name,
      user_type: formData.user_type,
    };

    if (formData.user_type === "tenant") {
      payload.phone_number = formData.phone_number;
      payload.tenant = formData.tenant;
    } else if (formData.user_type === "landlord") {
      payload.landlord = formData.landlord;
    }

    const res = await register(payload);

    setLoading(false);

    if (res.success) {
      navigate("/verify", { state: { email: formData.email } });
    } else {
      setError(res.error || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Create an Account
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
          />
          <input
            type="password"
            name="password2"
            placeholder="Confirm Password"
            value={formData.password2}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
          />

          {/* Select user type */}
          <select
            name="user_type"
            value={formData.user_type}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          >
            <option value="tenant">Tenant</option>
            <option value="landlord">Landlord</option>
          </select>

          {/* Tenant Fields */}
          {formData.user_type === "tenant" && (
            <>
              <input
                type="text"
                name="phone_number"
                placeholder="Phone Number"
                value={formData.phone_number}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="date"
                name="tenant.date_of_birth"
                value={formData.tenant.date_of_birth}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg"
              />
              <textarea
                name="tenant.bio"
                placeholder="Bio"
                value={formData.tenant.bio}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </>
          )}

          {/* Landlord Fields */}
          {formData.user_type === "landlord" && (
            <>
              <input
                type="text"
                name="landlord.phone_number"
                placeholder="Phone Number"
                value={formData.landlord.phone_number}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="text"
                name="landlord.property_name"
                placeholder="Property Name"
                value={formData.landlord.property_name}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="number"
                name="landlord.years_experience"
                placeholder="Years of Experience"
                value={formData.landlord.years_experience}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="url"
                name="landlord.website"
                placeholder="Website"
                value={formData.landlord.website}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
              <textarea
                name="landlord.bio"
                placeholder="Bio"
                value={formData.landlord.bio}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="text"
                name="landlord.location"
                placeholder="Location"
                value={formData.landlord.location}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
