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

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // handle input
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

  // step validation
  const validateStep = () => {
    let newErrors = {};

    if (step === 1) {
      if (!formData.first_name) newErrors.first_name = "First name is required";
      if (!formData.last_name) newErrors.last_name = "Last name is required";
    }

    if (step === 2) {
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else {
        if (formData.password.length < 8) {
          newErrors.password = "Password must be at least 8 characters";
        }
        if (!/[0-9]/.test(formData.password)) {
          newErrors.password = "Password must contain at least one number";
        }
        if (!/[A-Za-z]/.test(formData.password)) {
          newErrors.password = "Password must contain at least one letter";
        }
      }
      if (formData.password2 !== formData.password) {
        newErrors.password2 = "Passwords do not match";
      }
    }

    if (step === 4 && formData.user_type === "tenant") {
      if (!/^\d{1,11}$/.test(formData.phone_number)) {
        newErrors.phone_number = "Phone number must be numbers only, max 11 digits";
      }
      if (!formData.tenant.date_of_birth) {
        newErrors["tenant.date_of_birth"] = "Date of birth is required";
      }
      if (formData.tenant.bio.length > 200) {
        newErrors["tenant.bio"] = "Bio cannot exceed 200 characters";
      }
    }

    if (step === 4 && formData.user_type === "landlord") {
      if (!/^\d{1,11}$/.test(formData.landlord.phone_number)) {
        newErrors["landlord.phone_number"] =
          "Phone number must be numbers only, max 11 digits";
      }
      if (formData.landlord.property_name.length > 200) {
        newErrors["landlord.property_name"] =
          "Property name cannot exceed 200 characters";
      }
      if (formData.landlord.website && !/^https?:\/\/.+/.test(formData.landlord.website)) {
        newErrors["landlord.website"] = "Enter a valid website URL";
      }
      if (formData.landlord.bio.length > 200) {
        newErrors["landlord.bio"] = "Bio cannot exceed 200 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // go to next step
  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  // go back
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
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
    } else {
      payload.landlord = formData.landlord;
    }

    try {
      const res = await register(payload);
      setLoading(false);

      if (res.success) {
        navigate("/verify", { state: { email: formData.email } });
      } else {
        setErrors(res.errors || { general: res.error });
      }
    } catch {
      setLoading(false);
      setErrors({ general: "Unexpected error. Try again." });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-lg">
        {/* Progress Bar */}
        <div className="mb-6 h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-green-500 transition-all duration-500"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {errors.general && (
          <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
            ⚠️ {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* STEP 1: Names */}
          {step === 1 && (
            <>
              <input
                type="text"
                name="first_name"
                placeholder="First Name *"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2"
              />
              {errors.first_name && (
                <p className="text-sm text-red-600">{errors.first_name}</p>
              )}
              <input
                type="text"
                name="last_name"
                placeholder="Last Name *"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2"
              />
              {errors.last_name && (
                <p className="text-sm text-red-600">{errors.last_name}</p>
              )}
            </>
          )}

          {/* STEP 2: Email + Password */}
          {step === 2 && (
            <>
              <input
                type="email"
                name="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2"
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password *"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2 text-gray-500"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}

              <input
                type="password"
                name="password2"
                placeholder="Confirm Password *"
                value={formData.password2}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2"
              />
              {errors.password2 && (
                <p className="text-sm text-red-600">{errors.password2}</p>
              )}
            </>
          )}

          {/* STEP 3: Role */}
          {step === 3 && (
            <select
              name="user_type"
              value={formData.user_type}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2"
            >
              <option value="tenant">Tenant</option>
              <option value="landlord">Landlord</option>
            </select>
          )}

          {/* STEP 4: Role-specific fields */}
          {step === 4 && formData.user_type === "tenant" && (
            <>
              <input
                type="text"
                name="phone_number"
                placeholder="Phone Number *"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2"
              />
              {errors.phone_number && (
                <p className="text-sm text-red-600">{errors.phone_number}</p>
              )}

              <input
                type="date"
                name="tenant.date_of_birth"
                value={formData.tenant.date_of_birth}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2"
              />
              {errors["tenant.date_of_birth"] && (
                <p className="text-sm text-red-600">{errors["tenant.date_of_birth"]}</p>
              )}

              <textarea
                name="tenant.bio"
                placeholder="Bio (max 200 chars)"
                maxLength="200"
                value={formData.tenant.bio}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2"
              />
              {errors["tenant.bio"] && (
                <p className="text-sm text-red-600">{errors["tenant.bio"]}</p>
              )}
            </>
          )}

          {step === 4 && formData.user_type === "landlord" && (
            <>
              <input
                type="text"
                name="landlord.phone_number"
                placeholder="Phone Number *"
                value={formData.landlord.phone_number}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2"
              />
              {errors["landlord.phone_number"] && (
                <p className="text-sm text-red-600">{errors["landlord.phone_number"]}</p>
              )}

              <input
                type="text"
                name="landlord.property_name"
                placeholder="Property Name (max 200 chars)"
                maxLength="200"
                value={formData.landlord.property_name}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2"
              />
              {errors["landlord.property_name"] && (
                <p className="text-sm text-red-600">{errors["landlord.property_name"]}</p>
              )}

              <input
                type="number"
                name="landlord.years_experience"
                placeholder="Years of Experience"
                value={formData.landlord.years_experience}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2"
              />

              <input
                type="url"
                name="landlord.website"
                placeholder="Website"
                value={formData.landlord.website}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2"
              />
              {errors["landlord.website"] && (
                <p className="text-sm text-red-600">{errors["landlord.website"]}</p>
              )}

              <textarea
                name="landlord.bio"
                placeholder="Bio (max 200 chars)"
                maxLength="200"
                value={formData.landlord.bio}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2"
              />
              {errors["landlord.bio"] && (
                <p className="text-sm text-red-600">{errors["landlord.bio"]}</p>
              )}

              <input
                type="text"
                name="landlord.location"
                placeholder="Location"
                value={formData.landlord.location}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2"
              />
            </>
          )}

          {/* STEP 5: Final Submit */}
          {step === 5 && (
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-600 py-2 font-semibold text-white shadow-md hover:bg-green-700"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mx-auto"></div>
              ) : (
                "Done"
              )}
            </button>
          )}
        </form>

        {/* Step navigation */}
        <div className="mt-6 flex justify-between">
          {step > 1 && step < 5 && (
            <button
              onClick={handleBack}
              className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700"
            >
              Back
            </button>
          )}
          {step < 5 && (
            <button
              onClick={handleNext}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
