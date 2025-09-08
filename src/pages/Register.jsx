// src/pages/Register.jsx
import React, { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
    user_type: "tenant", // default
    landlord: {
      phone_number: "",
      property_name: "",
      years_experience: "",
      website: "",
      bio: "",
      location: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("landlord.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        landlord: { ...prev.landlord, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg("");

    // Build payload
    const payload = {
      email: formData.email,
      password: formData.password,
      password2: formData.password2,
      first_name: formData.first_name,
      last_name: formData.last_name,
      user_type: formData.user_type,
    };

    // Add landlord fields only if user_type is landlord
    if (formData.user_type === "landlord") {
      payload.landlord = {
        phone_number: formData.landlord.phone_number,
        property_name: formData.landlord.property_name,
        // Only include optional fields if filled
        ...(formData.landlord.years_experience && { years_experience: formData.landlord.years_experience }),
        ...(formData.landlord.website && { website: formData.landlord.website }),
        ...(formData.landlord.bio && { bio: formData.landlord.bio }),
        ...(formData.landlord.location && { location: formData.landlord.location }),
      };
    }

    console.log("Register payload:", payload);

    try {
      const res = await fetch("https://greengrass-backend.onrender.com/api/accounts/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Register response:", data);

      if (res.ok) {
        setSuccessMsg("Registration successful! Please login.");
      } else {
        // Show all backend errors
        setErrors(data);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setErrors({ network: ["Network error. Please try again."] });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      {successMsg && <p className="text-green-600 mb-2">{successMsg}</p>}

      {Object.keys(errors).length > 0 && (
        <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
          {Object.entries(errors).map(([field, msgs]) =>
            msgs.map((msg, idx) => <p key={`${field}-${idx}`}>{field}: {msg}</p>)
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password2"
          placeholder="Confirm Password"
          value={formData.password2}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <select
          name="user_type"
          value={formData.user_type}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="tenant">Tenant</option>
          <option value="landlord">Landlord</option>
        </select>

        {formData.user_type === "landlord" && (
          <div className="space-y-2 mt-2 border p-2 rounded bg-gray-50">
            <input
              type="text"
              name="landlord.phone_number"
              placeholder="Phone Number"
              value={formData.landlord.phone_number}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="landlord.property_name"
              placeholder="Property Name"
              value={formData.landlord.property_name}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
            <input
              type="number"
              name="landlord.years_experience"
              placeholder="Years Experience"
              value={formData.landlord.years_experience}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            <input
              type="url"
              name="landlord.website"
              placeholder="Website"
              value={formData.landlord.website}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="landlord.bio"
              placeholder="Bio"
              value={formData.landlord.bio}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="landlord.location"
              placeholder="Location"
              value={formData.landlord.location}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
