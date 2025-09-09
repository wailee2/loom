// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

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
  const [showPassword2, setShowPassword2] = useState(false);

  // compute maxStep based on selected role
  const maxStep = formData.user_type === "landlord" ? 8 : 7;

  // general handleChange keeps your logic intact
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

  // phone (top-level tenant phone) - restrict to digits and max 11
  const handlePhoneNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 11);
    setFormData((prev) => ({ ...prev, phone_number: val }));
  };

  // landlord phone - restrict digits max 11
  const handleLandlordPhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 11);
    setFormData((prev) => ({
      ...prev,
      landlord: { ...prev.landlord, phone_number: val },
    }));
  };

  // tenant bio - limit 200 chars and show counter
  const handleTenantBioChange = (e) => {
    const val = e.target.value.slice(0, 200);
    setFormData((prev) => ({ ...prev, tenant: { ...prev.tenant, bio: val } }));
  };

  // landlord bio
  const handleLandlordBioChange = (e) => {
    const val = e.target.value.slice(0, 200);
    setFormData((prev) => ({
      ...prev,
      landlord: { ...prev.landlord, bio: val },
    }));
  };

  // property name (max 50)
  const handlePropertyNameChange = (e) => {
    const val = e.target.value.slice(0, 50);
    setFormData((prev) => ({
      ...prev,
      landlord: { ...prev.landlord, property_name: val },
    }));
  };

  // location (max 50)
  const handleLocationChange = (e) => {
    const val = e.target.value.slice(0, 50);
    setFormData((prev) => ({
      ...prev,
      landlord: { ...prev.landlord, location: val },
    }));
  };

  // website: allow only URL-safe characters while typing/pasting;
  // final validation (in validateStep) will require http(s)://
  const handleWebsiteChange = (e) => {
    // Allow characters common in URLs only
    const filtered = e.target.value.replace(
      /[^A-Za-z0-9\-._~:\/?#\[\]@!$&'()*+,;=%]/g,
      ""
    );
    setFormData((prev) => ({
      ...prev,
      landlord: { ...prev.landlord, website: filtered },
    }));
  };

  // Password fields: use normal handleChange but prevent super-long strings (optional)
  const handlePasswordChange = (e) => {
    // limit to 256 chars to be safe
    const val = e.target.value.slice(0, 256);
    setFormData((prev) => ({ ...prev, [e.target.name]: val }));
  };

  // step validation - updated for new step mapping
  const validateStep = () => {
    let newErrors = {};

    // STEP 1: Names
    if (step === 1) {
      if (!formData.first_name) newErrors.first_name = "First name is required";
      if (!formData.last_name) newErrors.last_name = "Last name is required";
    }

    // STEP 2: Email + Password
    if (step === 2) {
      if (!formData.email) newErrors.email = "Email is required";

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else {
        if (formData.password.length < 8) {
          newErrors.password = "Password must be at least 8 characters long";
        }

        if (/^\d+$/.test(formData.password)) {
          newErrors.password = "Password cannot be entirely numeric";
        }

        const lowered = formData.password.toLowerCase();
        if (
          formData.first_name &&
          lowered.includes(formData.first_name.toLowerCase())
        ) {
          newErrors.password = "Password is too similar to your first name";
        }
        if (
          formData.last_name &&
          lowered.includes(formData.last_name.toLowerCase())
        ) {
          newErrors.password = "Password is too similar to your last name";
        }
        if (
          formData.email &&
          lowered.includes(formData.email.split("@")[0].toLowerCase())
        ) {
          newErrors.password = "Password is too similar to your email";
        }
      }

      if (formData.password2 !== formData.password) {
        newErrors.password2 = "Passwords do not match";
      }
    }


    // STEP 3: Role selection
    if (step === 3) {
      if (!formData.user_type) newErrors.user_type = "Role is required";
    }

    // TENANT FLOW
    if (formData.user_type === "tenant") {
      if (step === 4) {
        if (!formData.phone_number) {
          newErrors.phone_number = "Phone number is required";
        } else if (!/^\d{1,11}$/.test(formData.phone_number)) {
          newErrors.phone_number =
            "Phone number must be numbers only, max 11 digits";
        }
      }

      if (step === 5) {
        if (!formData.tenant.date_of_birth) {
          newErrors["tenant.date_of_birth"] = "Date of birth is required";
        }
      }

      if (step === 6) {
        if (!formData.tenant.bio) {
          newErrors["tenant.bio"] = "Bio is required";
        } else if (formData.tenant.bio.length > 200) {
          newErrors["tenant.bio"] = "Bio cannot exceed 200 characters";
        }
      }

      // step 7 is confirmation for tenant — no extra checks here
    }

    // LANDLORD FLOW
    if (formData.user_type === "landlord") {
      if (step === 4) {
        if (!formData.landlord.phone_number) {
          newErrors["landlord.phone_number"] = "Phone number is required";
        } else if (!/^\d{1,11}$/.test(formData.landlord.phone_number)) {
          newErrors["landlord.phone_number"] =
            "Phone number must be numbers only, max 11 digits";
        }
      }

      if (step === 5) {
        if (!formData.landlord.property_name) {
          newErrors["landlord.property_name"] = "Property name is required";
        } else if (formData.landlord.property_name.length > 50) {
          newErrors["landlord.property_name"] =
            "Property name cannot exceed 50 characters";
        }

        if (!formData.landlord.years_experience) {
          newErrors["landlord.years_experience"] =
            "Years of experience is required";
        }
      }

      if (step === 6) {
        // website and location required on step 6 for landlord per your mapping
        if (!formData.landlord.location) {
          newErrors["landlord.location"] = "Location is required";
        } else if (formData.landlord.location.length > 50) {
          newErrors["landlord.location"] = "Location cannot exceed 50 characters";
        }

        if (!formData.landlord.website) {
          newErrors["landlord.website"] = "Website is required";
        } else if (!/^https?:\/\/.+/.test(formData.landlord.website)) {
          newErrors["landlord.website"] =
            "Website must be a valid URL starting with http:// or https://";
        }
      }

      if (step === 7) {
        if (!formData.landlord.bio) {
          newErrors["landlord.bio"] = "Bio is required";
        } else if (formData.landlord.bio.length > 200) {
          newErrors["landlord.bio"] = "Bio cannot exceed 200 characters";
        }
      }

      // step 8 is confirmation for landlord — no extra checks here
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // go to next step
  const handleNext = () => {
    if (validateStep()) {
      // ensure we don't go past computed maxStep (in case role changed)
      setStep((s) => Math.min(s + 1, maxStep));
    }
  };

  // go back
  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    // keep payload shape exactly as you had it
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
        setErrors(res.errors || { general: res.error || "Registration failed" });
      }
    } catch (err) {
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
            style={{ width: `${(step / maxStep) * 100}%` }}
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

              {/* password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password *"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  className="w-full rounded-lg border px-3 py-2 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}

              <div className="relative">
                <input
                  type={showPassword2 ? "text" : "password"}
                  name="password2"
                  placeholder="Confirm Password *"
                  value={formData.password2}
                  onChange={handlePasswordChange}
                  className="w-full rounded-lg border px-3 py-2 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword2((s) => !s)}
                  className="absolute right-2 top-2 text-gray-500"
                >
                  {showPassword2 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password2 && (
                <p className="text-sm text-red-600">{errors.password2}</p>
              )}
            </>
          )}

          {/* STEP 3: Role selection (buttons) */}
          {step === 3 && (
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, user_type: "tenant" }))
                }
                className={`flex-1 rounded-lg border px-4 py-3 font-medium ${
                  formData.user_type === "tenant"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                Tenant
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, user_type: "landlord" }))
                }
                className={`flex-1 rounded-lg border px-4 py-3 font-medium ${
                  formData.user_type === "landlord"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                Landlord
              </button>
              {errors.user_type && (
                <p className="text-sm text-red-600">{errors.user_type}</p>
              )}
            </div>
          )}

          {/* ROLE-SPECIFIC FLOW: TENANT */}
          {formData.user_type === "tenant" && (
            <>
              {step === 4 && (
                <>
                  <input
                    type="tel"
                    name="phone_number"
                    placeholder="Phone Number *"
                    value={formData.phone_number}
                    onChange={handlePhoneNumberChange}
                    className="w-full rounded-lg border px-3 py-2"
                    inputMode="numeric"
                  />
                  {errors.phone_number && (
                    <p className="text-sm text-red-600">{errors.phone_number}</p>
                  )}
                </>
              )}

              {step === 5 && (
                <>
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
                </>
              )}

              {step === 6 && (
                <>
                  <label className="text-xs text-gray-600 flex justify-end">
                    <span className="mr-auto text-sm">Bio (required)</span>
                    <span>{formData.tenant.bio.length}/200</span>
                  </label>
                  <textarea
                    name="tenant.bio"
                    placeholder="Bio (max 200 chars) *"
                    maxLength={200}
                    value={formData.tenant.bio}
                    onChange={handleTenantBioChange}
                    className="w-full rounded-lg border px-3 py-2"
                  />
                  {errors["tenant.bio"] && (
                    <p className="text-sm text-red-600">{errors["tenant.bio"]}</p>
                  )}
                </>
              )}
            </>
          )}

          {/* ROLE-SPECIFIC FLOW: LANDLORD */}
          {formData.user_type === "landlord" && (
            <>
              {step === 4 && (
                <>
                  <input
                    type="tel"
                    name="landlord.phone_number"
                    placeholder="Phone Number *"
                    value={formData.landlord.phone_number}
                    onChange={handleLandlordPhoneChange}
                    className="w-full rounded-lg border px-3 py-2"
                    inputMode="numeric"
                  />
                  {errors["landlord.phone_number"] && (
                    <p className="text-sm text-red-600">{errors["landlord.phone_number"]}</p>
                  )}
                </>
              )}

              {step === 5 && (
                <>
                  <label className="text-xs text-gray-600 flex justify-end">
                    <span className="mr-auto text-sm">Property Name (required)</span>
                    <span>{formData.landlord.property_name.length}/50</span>
                  </label>
                  <input
                    type="text"
                    name="landlord.property_name"
                    placeholder="Property Name (max 50 chars) *"
                    maxLength={50}
                    value={formData.landlord.property_name}
                    onChange={handlePropertyNameChange}
                    className="w-full rounded-lg border px-3 py-2"
                  />
                  {errors["landlord.property_name"] && (
                    <p className="text-sm text-red-600">{errors["landlord.property_name"]}</p>
                  )}

                  <input
                    type="number"
                    name="landlord.years_experience"
                    placeholder="Years of Experience *"
                    value={formData.landlord.years_experience}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-3 py-2"
                  />
                  {errors["landlord.years_experience"] && (
                    <p className="text-sm text-red-600">{errors["landlord.years_experience"]}</p>
                  )}
                </>
              )}

              {step === 6 && (
                <>
                  <label className="block text-sm text-gray-600">Website (required)</label>
                  <input
                    type="text"
                    name="landlord.website"
                    placeholder="https://example.com *"
                    value={formData.landlord.website}
                    onChange={handleWebsiteChange}
                    className="w-full rounded-lg border px-3 py-2"
                  />
                  {errors["landlord.website"] && (
                    <p className="text-sm text-red-600">{errors["landlord.website"]}</p>
                  )}

                  <label className="text-xs text-gray-600 flex justify-end">
                    <span className="mr-auto text-sm">Location (required)</span>
                    <span>{formData.landlord.location.length}/50</span>
                  </label>
                  <input
                    type="text"
                    name="landlord.location"
                    placeholder="Location (max 50 chars) *"
                    maxLength={50}
                    value={formData.landlord.location}
                    onChange={handleLocationChange}
                    className="w-full rounded-lg border px-3 py-2"
                  />
                  {errors["landlord.location"] && (
                    <p className="text-sm text-red-600">{errors["landlord.location"]}</p>
                  )}
                </>
              )}

              {step === 7 && (
                <>
                  <label className="text-xs text-gray-600 flex justify-end">
                    <span className="mr-auto text-sm">Bio (required)</span>
                    <span>{formData.landlord.bio.length}/200</span>
                  </label>
                  <textarea
                    name="landlord.bio"
                    placeholder="Bio (max 200 chars) *"
                    maxLength={200}
                    value={formData.landlord.bio}
                    onChange={handleLandlordBioChange}
                    className="w-full rounded-lg border px-3 py-2"
                  />
                  {errors["landlord.bio"] && (
                    <p className="text-sm text-red-600">{errors["landlord.bio"]}</p>
                  )}
                </>
              )}
            </>
          )}

          {/* CONFIRMATION: tenant (step 7) or landlord (step 8) -> render when step === maxStep */}
          {step === maxStep && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Confirm Your Details
              </h2>
              <div className="rounded-lg border p-4 text-sm space-y-2">
                <p><strong>Name:</strong> {formData.first_name} {formData.last_name}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Role:</strong> {formData.user_type}</p>

                {formData.user_type === "tenant" && (
                  <>
                    <p><strong>Phone:</strong> {formData.phone_number}</p>
                    <p><strong>Date of Birth:</strong> {formData.tenant.date_of_birth}</p>
                    <p><strong>Bio:</strong> {formData.tenant.bio}</p>
                  </>
                )}

                {formData.user_type === "landlord" && (
                  <>
                    <p><strong>Phone:</strong> {formData.landlord.phone_number}</p>
                    <p><strong>Property Name:</strong> {formData.landlord.property_name}</p>
                    <p><strong>Years of Experience:</strong> {formData.landlord.years_experience}</p>
                    <p><strong>Website:</strong> {formData.landlord.website || "N/A"}</p>
                    <p><strong>Bio:</strong> {formData.landlord.bio}</p>
                    <p><strong>Location:</strong> {formData.landlord.location}</p>
                  </>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="rounded-lg bg-gray-300 px-4 py-2 font-semibold text-gray-700"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
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
            </div>
          )}
        </form>

        {/* Step navigation */}
        <div className="mt-6 flex justify-between">
          {step > 1 && step < maxStep && (
            <button
              onClick={handleBack}
              className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700"
            >
              Back
            </button>
          )}
          {step < maxStep && (
            <button
              onClick={handleNext}
              className="ml-auto rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white"
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