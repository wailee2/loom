// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

const steps = ["Name", "Account", "Role", "Details", "Bio"];

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

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

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

  const validateStep = () => {
    const newErrors = {};
    if (step === 0) {
      if (!formData.first_name) newErrors.first_name = "First name is required";
      if (!formData.last_name) newErrors.last_name = "Last name is required";
    }
    if (step === 1) {
      if (!formData.email.includes("@")) newErrors.email = "Enter a valid email";
      if (formData.password.length < 8 || !/\d/.test(formData.password))
        newErrors.password =
          "Password must be at least 8 characters and alphanumeric";
      if (formData.password !== formData.password2)
        newErrors.password2 = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep((s) => s + 1);
  };
  const prevStep = () => setStep((s) => s - 1);

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
      } else if (res.errors) {
        setErrors(res.errors);
      } else if (res.error) {
        if (res.error.toLowerCase().includes("email"))
          setErrors({ email: "Email already exists" });
        else setErrors({ general: res.error });
      } else {
        setErrors({ general: "Registration failed. Please try again." });
      }
    } catch {
      setLoading(false);
      setErrors({ general: "Unexpected error. Please try again." });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-lg">
        {/* Progress bar */}
        <div className="mb-6 flex items-center">
          {steps.map((label, idx) => (
            <div key={idx} className="flex-1">
              <div
                className={`h-2 rounded-full ${
                  idx <= step ? "bg-green-500" : "bg-gray-200"
                }`}
              ></div>
            </div>
          ))}
        </div>

        {errors.general && (
          <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
            ⚠️ {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 0: Name */}
          {step === 0 && (
            <div className="space-y-4">
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
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
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2"
              />
              {errors.last_name && (
                <p className="text-sm text-red-600">{errors.last_name}</p>
              )}
            </div>
          )}

          {/* Step 1: Account */}
          {step === 1 && (
            <div className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2 pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}

              <input
                type="password"
                name="password2"
                placeholder="Confirm Password"
                value={formData.password2}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2"
              />
              {errors.password2 && (
                <p className="text-sm text-red-600">{errors.password2}</p>
              )}
            </div>
          )}

          {/* Step 2: Role */}
          {step === 2 && (
            <div>
              <select
                name="user_type"
                value={formData.user_type}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2"
              >
                <option value="tenant">Tenant</option>
                <option value="landlord">Landlord</option>
              </select>
            </div>
          )}

          {/* Step 3: Role-specific details */}
          {step === 3 && formData.user_type === "tenant" && (
            <div className="space-y-4">
              <input
                type="text"
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
            </div>
          )}

          {step === 3 && formData.user_type === "landlord" && (
            <div className="space-y-4">
              <input
                type="text"
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
                placeholder="Years Experience"
                value={formData.landlord.years_experience}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
          )}

          {/* Step 4: Bio */}
          {step === 4 && (
            <textarea
              name={
                formData.user_type === "tenant" ? "tenant.bio" : "landlord.bio"
              }
              placeholder="Tell us about yourself..."
              value={
                formData.user_type === "tenant"
                  ? formData.tenant.bio
                  : formData.landlord.bio
              }
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2"
            />
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-4">
            {step > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className="rounded-lg border px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                Back
              </button>
            )}
            {step < steps.length - 1 && (
              <button
                type="button"
                onClick={nextStep}
                className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Next
              </button>
            )}
            {step === steps.length - 1 && (
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
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
