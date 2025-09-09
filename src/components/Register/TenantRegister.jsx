// src/components/TenantRegister.jsx
import React from "react";

const TenantRegister = ({
  step,
  formData,
  errors,
  handlePhoneNumberChange,
  handleTenantBioChange,
  bpView,
  setBpView,
  bpMonth,
  bpYear,
  bpSelected,
  handlePrevMonth,
  handleNextMonth,
  handlePickDay,
  handleSelectMonth,
  handleSelectYear,
  monthNames,
  firstDayIndex,
  daysInMonth,
  handleBack,
  handleNext,
  setFormData,
  formatISO,
  setErrors,
}) => {
  return (
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
                  {/* MODERN BIRTHDAY PICKER - START */}
                  <div className="border-2 border-green-500 rounded-xl p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                      {/* LEFT: Calendar */}
                      <div className="w-full lg:w-2/3 bg-white rounded-md p-3 shadow-sm">
                        {/* Top Header: day month year (clickable) */}
                        <div className="flex flex-col items-center justify-between mb-3 ">
                          <div className="flex gap-3 items-center">
                            <button
                              type="button"
                              onClick={() => setBpView("day")}
                              className={`text-left text-sm px-2 py-1 rounded-md ${
                                bpView === "day"
                                  ? "bg-green-600 text-white"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              Day
                            </button>

                            <button
                              type="button"
                              onClick={() => setBpView("month")}
                              className={`text-left text-sm px-2 py-1 rounded-md ${
                                bpView === "month"
                                  ? "bg-green-600 text-white"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              Month
                            </button>

                            <button
                              type="button"
                              onClick={() => setBpView("year")}
                              className={`text-left text-sm px-2 py-1 rounded-md ${
                                bpView === "year"
                                  ? "bg-green-600 text-white"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              Year
                            </button>
                          </div>

                          {/* Month and Year with arrows */}
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={handlePrevMonth}
                              className="rounded-full p-2 hover:bg-gray-100"
                              aria-label="Previous"
                            >
                              ←
                            </button>
                            <div className="px-3 py-1 rounded-md text-sm font-medium">
                              {monthNames[bpMonth]} {bpYear}
                            </div>
                            <button
                              type="button"
                              onClick={handleNextMonth}
                              className="rounded-full p-2 hover:bg-gray-100"
                              aria-label="Next"
                            >
                              →
                            </button>
                          </div>
                        </div>

                        {/* Calendar Body */}
                        <div>
                          {bpView === "day" && (
                            <div>
                              <div className="grid grid-cols-7 gap-2 text-xs text-center text-gray-500 mb-2">
                                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                                  <div key={d}>{d}</div>
                                ))}
                              </div>

                              <div className="grid grid-cols-7 gap-2">
                                {/* empty slots */}
                                {Array.from({ length: firstDayIndex(bpYear, bpMonth) }).map((_, i) => (
                                  <div key={`e${i}`} className="h-10" />
                                ))}

                                {/* days */}
                                {Array.from({ length: daysInMonth(bpYear, bpMonth) }).map((_, idx) => {
                                  const day = idx + 1;
                                  const selected =
                                    bpSelected &&
                                    bpSelected.getFullYear() === bpYear &&
                                    bpSelected.getMonth() === bpMonth &&
                                    bpSelected.getDate() === day;
                                  return (
                                    <button
                                      key={day}
                                      type="button"
                                      onClick={() => handlePickDay(day)}
                                      className={`h-10 rounded-md flex items-center justify-center text-sm font-medium hover:bg-gray-100 ${
                                        selected ? "bg-green-600 text-white" : "text-gray-700"
                                      }`}
                                    >
                                      {day}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {bpView === "month" && (
                            <div className="grid grid-cols-3 gap-2">
                              {monthNames.map((m, i) => (
                                <button
                                  key={m}
                                  type="button"
                                  onClick={() => handleSelectMonth(i)}
                                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 ${
                                    bpMonth === i ? "bg-green-600 text-white" : "text-gray-700"
                                  }`}
                                >
                                  {m.slice(0, 3)}
                                </button>
                              ))}
                            </div>
                          )}

                          {bpView === "year" && (
                            <div className="grid grid-cols-4 gap-2">
                              {Array.from({ length: 12 }).map((_, i) => {
                                const yearStart = bpYear - 5;
                                const y = yearStart + i;
                                return (
                                  <button
                                    key={y}
                                    type="button"
                                    onClick={() => handleSelectYear(y)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 ${
                                      bpYear === y ? "bg-green-600 text-white" : "text-gray-700"
                                    }`}
                                  >
                                    {y}
                                  </button>
                                );
                              })}
                              {/* quick controls to shift year range */}
                              <div className="col-span-4 flex justify-between mt-2">
                                <button
                                  type="button"
                                  onClick={() => setBpYear((y) => y - 12)}
                                  className="px-3 py-1 rounded-md text-sm hover:bg-gray-100"
                                >
                                  ← Prev range
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setBpYear((y) => y + 12)}
                                  className="px-3 py-1 rounded-md text-sm hover:bg-gray-100"
                                >
                                  Next range →
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* RIGHT: Preview + controls */}
                      <div className="w-full lg:w-1/3 bg-gray-50 rounded-md p-4 flex flex-col justify-between">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Please select your birthday</div>
                          <div className="flex items-baseline gap-3">
                            <div className="text-4xl font-extrabold">
                              {bpSelected.getDate()}
                            </div>
                            <div>
                              <div className="text-2xl font-bold">
                                {bpSelected.toLocaleDateString(undefined, { weekday: "long" })}
                              </div>
                              <div className="text-sm text-gray-600">
                                {monthNames[bpSelected.getMonth()]}, {bpSelected.getFullYear()}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-3">
                          <button
                            type="button"
                            onClick={handleBack}
                            className="flex-1 rounded-lg bg-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-400"
                          >
                            Back
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              // ensure date saved already (bpSelected -> formData)
                              if (bpSelected) {
                                setFormData((prev) => ({
                                  ...prev,
                                  tenant: { ...prev.tenant, date_of_birth: formatISO(bpSelected) },
                                }));
                                // proceed to next step using your logic
                                handleNext();
                              } else {
                                // set error for UX (won't change your validation logic)
                                setErrors((prev) => ({
                                  ...prev,
                                  ["tenant.date_of_birth"]: "Please select your date of birth",
                                }));
                              }
                            }}
                            className="flex-1 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
                          >
                            Next
                          </button>
                        </div>

                        {errors["tenant.date_of_birth"] && (
                          <p className="mt-2 text-sm text-red-600">{errors["tenant.date_of_birth"]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* MODERN BIRTHDAY PICKER - END */}
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
  );
};

export default TenantRegister;
