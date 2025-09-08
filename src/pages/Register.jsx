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
    tenant: { date_of_birth: "", bio: "" },
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
  const [errors, setErrors] = useState({});

  // handle general form input change
  const handleChange = (e) => {
    const { name, value } = e.target;

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
    setErrors({});

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

    try {
      const res = await register(payload);
      setLoading(false);

      if (res.success) {
        navigate("/verify", { state: { email: formData.email } });
      } else {
        if (res.errors) {
          setErrors(res.errors); // structured errors from backend
        } else if (res.error) {
          setErrors({ general: res.error });
        } else {
          setErrors({ general: "Registration failed. Please try again." });
        }
      }
    } catch (err) {
      setLoading(false);
      setErrors({ general: "An unexpected error occurred. Please try again." });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Create an Account
        </h2>

        {errors.general && (
          <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
            ⚠️ {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
              {errors.first_name && (
                <p className="text-sm text-red-600">{errors.first_name[0]}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
              {errors.last_name && (
                <p className="text-sm text-red-600">{errors.last_name[0]}</p>
              )}
            </div>
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password[0]}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password2"
                placeholder="Confirm Password"
                value={formData.password2}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
              {errors.password2 && (
                <p className="text-sm text-red-600">{errors.password2[0]}</p>
              )}
            </div>
          </div>

          {/* Select user type */}
          <div>
            <select
              name="user_type"
              value={formData.user_type}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
            >
              <option value="tenant">Tenant</option>
              <option value="landlord">Landlord</option>
            </select>
            {errors.user_type && (
              <p className="text-sm text-red-600">{errors.user_type[0]}</p>
            )}
          </div>

          {/* Tenant Fields */}
          {formData.user_type === "tenant" && (
            <div className="space-y-4">
              <input
                type="text"
                name="phone_number"
                placeholder="Phone Number"
                value={formData.phone_number}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
              {errors.phone_number && (
                <p className="text-sm text-red-600">{errors.phone_number[0]}</p>
              )}

              <input
                type="date"
                name="tenant.date_of_birth"
                value={formData.tenant.date_of_birth}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
              {errors["tenant.date_of_birth"] && (
                <p className="text-sm text-red-600">
                  {errors["tenant.date_of_birth"][0]}
                </p>
              )}

              <textarea
                name="tenant.bio"
                placeholder="Bio"
                value={formData.tenant.bio}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
              {errors["tenant.bio"] && (
                <p className="text-sm text-red-600">
                  {errors["tenant.bio"][0]}
                </p>
              )}
            </div>
          )}

          {/* Landlord Fields */}
          {formData.user_type === "landlord" && (
            <div className="space-y-4">
              <input
                type="text"
                name="landlord.phone_number"
                placeholder="Phone Number"
                value={formData.landlord.phone_number}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
              {errors["landlord.phone_number"] && (
                <p className="text-sm text-red-600">
                  {errors["landlord.phone_number"][0]}
                </p>
              )}

              <input
                type="text"
                name="landlord.property_name"
                placeholder="Property Name"
                value={formData.landlord.property_name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
              {errors["landlord.property_name"] && (
                <p className="text-sm text-red-600">
                  {errors["landlord.property_name"][0]}
                </p>
              )}

              <input
                type="number"
                name="landlord.years_experience"
                placeholder="Years of Experience"
                value={formData.landlord.years_experience}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
              {errors["landlord.years_experience"] && (
                <p className="text-sm text-red-600">
                  {errors["landlord.years_experience"][0]}
                </p>
              )}

              <input
                type="url"
                name="landlord.website"
                placeholder="Website"
                value={formData.landlord.website}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
              {errors["landlord.website"] && (
                <p className="text-sm text-red-600">
                  {errors["landlord.website"][0]}
                </p>
              )}

              <textarea
                name="landlord.bio"
                placeholder="Bio"
                value={formData.landlord.bio}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
              {errors["landlord.bio"] && (
                <p className="text-sm text-red-600">
                  {errors["landlord.bio"][0]}
                </p>
              )}

              <input
                type="text"
                name="landlord.location"
                placeholder="Location"
                value={formData.landlord.location}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
              {errors["landlord.location"] && (
                <p className="text-sm text-red-600">
                  {errors["landlord.location"][0]}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white shadow-md transition hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? (
              <svg
                className="h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-green-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
