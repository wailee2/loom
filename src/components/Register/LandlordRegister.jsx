// src/components/LandlordRegister.jsx
import React from "react";

const LandlordRegister = ({
  step,
  formData,
  errors,
  handleLandlordPhoneChange,
  handlePropertyNameChange,
  handleLocationChange,
  handleWebsiteChange,
  handleLandlordBioChange,
  handleChange,
}) => {
  return (
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
  );
};

export default LandlordRegister;
