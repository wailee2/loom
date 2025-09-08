// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

const steps = [
  "Name",
  "Account",
  "Role",
  "Details",
  "Bio",
];

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    user_type: "tenant",
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

  // frontend validations
  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.email.includes("@")) newErrors.email = "Invalid email.";
      if (formData.password.length < 8)
        newErrors.password = "Password must be at least 8 characters.";
      if (!/[0-9]/.test(formData.password))
        newErrors.password = "Password must contain at least one number.";
      if (!/[a-zA-Z]/.test(formData.password))
        newErrors.password = "Password must contain at least one alphabet.";
      if (formData.password !== formData.password2)
        newErrors.password2 = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep(step + 1);
  };
  const prevStep = () => setStep(step - 1);

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
    } else {
      payload.landlord = formData.landlord;
    }

    try {
      const res = await register(payload);
      setLoading(false);

      if (res.success) {
        navigate("/verify", { state: { email: formData.email } });
      } else {
        if (res.errors) setErrors(res.errors);
        else if (res.error) setErrors({ general: res.error });
        else setErrors({ general: "Registration failed. Try again." });
      }
    } catch {
      setLoading(false);
      setErrors({ general: "Unexpected error occurred. Try again." });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-md">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm font-medium text-gray-600">
            {steps.map((s, i) => (
              <span key={i} className={i <= step ? "text-green-600" : ""}>
                {s}
              </span>
            ))}
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-green-500 transition-all"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {errors.general && (
          <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
            ⚠️ {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 0: Names */}
          {step === 0 && (
            <>
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2"
                required
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2"
                required
              />
            </>
          )}

          {/* Step 1: Email + Passwords */}
          {step === 1 && (
            <>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2"
                required
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2 pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}

              <div className="relative">
                <input
                  type={showPassword2 ? "text" : "password"}
                  name="password2"
                  placeholder="Confirm Password"
                  value={formData.password2}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2 pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                  onClick={() => setShowPassword2(!showPassword2)}
                >
                  {showPassword2 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password2 && <p className="text-sm text-red-600">{errors.password2}</p>}
            </>
          )}

          {/* Step 2: Role */}
          {step === 2 && (
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

          {/* Step 3: Role Details */}
          {step === 3 && (
            <>
              {formData.user_type === "tenant" && (
                <>
                  <input
                    type="tel"
                    name="phone_number"
                    placeholder="Phone Number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-3 py-2"
                  />
                  <input
                    type="date"
                    name="tenant.date_of_birth"
                    value={formData.tenant.date_of_birth}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-3 py-2"
                  />
                </>
              )}
              {formData.user_type === "landlord" && (
                <>
                  <input
                    type="tel"
                    name="landlord.phone_number"
                    placeholder="Phone Number"
                    value={formData.landlord.phone_number}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-3 py-2"
                  />
                  <input
                    type="text"
                    name="landlord.property_name"
                    placeholder="Property Name"
                    value={formData.landlord.property_name}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-3 py-2"
                  />
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
            </>
          )}

          {/* Step 4: Bio */}
          {step === 4 && (
            <>
              {formData.user_type === "tenant" ? (
                <textarea
                  name="tenant.bio"
                  placeholder="Tell us about yourself..."
                  value={formData.tenant.bio}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2"
                />
              ) : (
                <textarea
                  name="landlord.bio"
                  placeholder="Tell us about yourself..."
                  value={formData.landlord.bio}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2"
                />
              )}
            </>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            {step > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
              >
                Back
              </button>
            )}
            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="ml-auto flex items-center rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
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
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
