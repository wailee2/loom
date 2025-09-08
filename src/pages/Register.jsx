// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
    user_type: "tenant",
    phone_number: "",
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

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.first_name) newErrors.first_name = "First name is required";
      if (!formData.last_name) newErrors.last_name = "Last name is required";
    }

    if (step === 2) {
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.password) newErrors.password = "Password is required";
      else if (formData.password.length < 8)
        newErrors.password = "Password must be at least 8 characters";
      else if (!/\d/.test(formData.password))
        newErrors.password = "Password must contain at least one number";

      if (formData.password !== formData.password2)
        newErrors.password2 = "Passwords do not match";
    }

    if (step === 3 && !formData.user_type) {
      newErrors.user_type = "Role is required";
    }

    if (step === 4 && formData.user_type === "tenant") {
      if (!formData.phone_number)
        newErrors.phone_number = "Phone number is required";
      if (!formData.tenant.date_of_birth)
        newErrors["tenant.date_of_birth"] = "Date of birth is required";
      if (!formData.tenant.bio) newErrors["tenant.bio"] = "Bio is required";
    }

    if (step === 4 && formData.user_type === "landlord") {
      if (!formData.landlord.phone_number)
        newErrors["landlord.phone_number"] = "Phone number is required";
      if (!formData.landlord.property_name)
        newErrors["landlord.property_name"] = "Property name is required";
      if (!formData.landlord.years_experience)
        newErrors["landlord.years_experience"] =
          "Years of experience is required";
      if (!formData.landlord.bio) newErrors["landlord.bio"] = "Bio is required";
      if (!formData.landlord.location)
        newErrors["landlord.location"] = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const nextStep = () => {
    if (validateStep()) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    try {
      await register(formData);
      navigate("/login");
    } catch (err) {
      setErrors({ submit: err.message || "Registration failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-xl bg-white p-6 shadow-lg"
      >
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Your Name</h2>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="First name"
              className="w-full rounded-lg border p-2"
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm">{errors.first_name}</p>
            )}
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Last name"
              className="w-full rounded-lg border p-2"
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm">{errors.last_name}</p>
            )}
            <button
              type="button"
              onClick={nextStep}
              className="ml-auto block rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Email & Password
            </h2>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full rounded-lg border p-2"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full rounded-lg border p-2"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full rounded-lg border p-2"
            />
            {errors.password2 && (
              <p className="text-red-500 text-sm">{errors.password2}</p>
            )}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="rounded-lg bg-gray-300 px-4 py-2 font-semibold text-gray-700"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Select Role</h2>
            <select
              name="user_type"
              value={formData.user_type}
              onChange={handleChange}
              className="w-full rounded-lg border p-2"
            >
              <option value="tenant">Tenant</option>
              <option value="landlord">Landlord</option>
            </select>
            {errors.user_type && (
              <p className="text-red-500 text-sm">{errors.user_type}</p>
            )}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="rounded-lg bg-gray-300 px-4 py-2 font-semibold text-gray-700"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">More Info</h2>
            {formData.user_type === "tenant" && (
              <>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className="w-full rounded-lg border p-2"
                />
                {errors.phone_number && (
                  <p className="text-red-500 text-sm">{errors.phone_number}</p>
                )}
                <input
                  type="date"
                  name="tenant.date_of_birth"
                  value={formData.tenant.date_of_birth}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-2"
                />
                {errors["tenant.date_of_birth"] && (
                  <p className="text-red-500 text-sm">
                    {errors["tenant.date_of_birth"]}
                  </p>
                )}
                <textarea
                  name="tenant.bio"
                  value={formData.tenant.bio}
                  onChange={handleChange}
                  placeholder="Bio"
                  className="w-full rounded-lg border p-2"
                />
                {errors["tenant.bio"] && (
                  <p className="text-red-500 text-sm">{errors["tenant.bio"]}</p>
                )}
              </>
            )}

            {formData.user_type === "landlord" && (
              <>
                <input
                  type="text"
                  name="landlord.phone_number"
                  value={formData.landlord.phone_number}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className="w-full rounded-lg border p-2"
                />
                {errors["landlord.phone_number"] && (
                  <p className="text-red-500 text-sm">
                    {errors["landlord.phone_number"]}
                  </p>
                )}
                <input
                  type="text"
                  name="landlord.property_name"
                  value={formData.landlord.property_name}
                  onChange={handleChange}
                  placeholder="Property name"
                  className="w-full rounded-lg border p-2"
                />
                {errors["landlord.property_name"] && (
                  <p className="text-red-500 text-sm">
                    {errors["landlord.property_name"]}
                  </p>
                )}
                <input
                  type="number"
                  name="landlord.years_experience"
                  value={formData.landlord.years_experience}
                  onChange={handleChange}
                  placeholder="Years of experience"
                  className="w-full rounded-lg border p-2"
                />
                {errors["landlord.years_experience"] && (
                  <p className="text-red-500 text-sm">
                    {errors["landlord.years_experience"]}
                  </p>
                )}
                <input
                  type="url"
                  name="landlord.website"
                  value={formData.landlord.website}
                  onChange={handleChange}
                  placeholder="Website (optional)"
                  className="w-full rounded-lg border p-2"
                />
                <textarea
                  name="landlord.bio"
                  value={formData.landlord.bio}
                  onChange={handleChange}
                  placeholder="Bio"
                  className="w-full rounded-lg border p-2"
                />
                {errors["landlord.bio"] && (
                  <p className="text-red-500 text-sm">
                    {errors["landlord.bio"]}
                  </p>
                )}
                <input
                  type="text"
                  name="landlord.location"
                  value={formData.landlord.location}
                  onChange={handleChange}
                  placeholder="Location"
                  className="w-full rounded-lg border p-2"
                />
                {errors["landlord.location"] && (
                  <p className="text-red-500 text-sm">
                    {errors["landlord.location"]}
                  </p>
                )}
              </>
            )}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="rounded-lg bg-gray-300 px-4 py-2 font-semibold text-gray-700"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 5 - Confirmation */}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Confirm Your Details
            </h2>
            <div className="rounded-lg border p-4 text-sm space-y-2">
              <p>
                <strong>Name:</strong> {formData.first_name}{" "}
                {formData.last_name}
              </p>
              <p>
                <strong>Email:</strong> {formData.email}
              </p>
              <p>
                <strong>Role:</strong> {formData.user_type}
              </p>

              {formData.user_type === "tenant" && (
                <>
                  <p>
                    <strong>Phone:</strong> {formData.phone_number}
                  </p>
                  <p>
                    <strong>Date of Birth:</strong>{" "}
                    {formData.tenant.date_of_birth}
                  </p>
                  <p>
                    <strong>Bio:</strong> {formData.tenant.bio}
                  </p>
                </>
              )}

              {formData.user_type === "landlord" && (
                <>
                  <p>
                    <strong>Phone:</strong> {formData.landlord.phone_number}
                  </p>
                  <p>
                    <strong>Property Name:</strong>{" "}
                    {formData.landlord.property_name}
                  </p>
                  <p>
                    <strong>Years of Experience:</strong>{" "}
                    {formData.landlord.years_experience}
                  </p>
                  <p>
                    <strong>Website:</strong>{" "}
                    {formData.landlord.website || "N/A"}
                  </p>
                  <p>
                    <strong>Bio:</strong> {formData.landlord.bio}
                  </p>
                  <p>
                    <strong>Location:</strong> {formData.landlord.location}
                  </p>
                </>
              )}
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="rounded-lg bg-gray-300 px-4 py-2 font-semibold text-gray-700"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
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
                  "Done"
                )}
              </button>
            </div>
            {errors.submit && (
              <p className="text-red-500 text-sm">{errors.submit}</p>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default Register;
