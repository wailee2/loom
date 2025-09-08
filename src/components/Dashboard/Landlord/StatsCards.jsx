// components/StatsCards.jsx
import React from "react";

// Earnings & Occupation style
export const ValueCard = ({ title, value, subtext, Icon, children }) => (
  <div className="bg-white shadow rounded-xl p-6 relative flex flex-col w-full ">
    {/* Top row: value + title left, icon right */}
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <h3 className="text-gray-700">{title}</h3>
      </div>
      <Icon className="text-green-300 text-3xl" />
    </div>

    {/* Bottom row: subtext left, chart right */}
    <div className="flex justify-between items-start gap-4 flex-wrap">
      {subtext && <p className="text-gray-400 text-sm">{subtext}</p>}
      <div className="w-full">{children}</div>
    </div>
  </div>
);

// Properties style
export const PropertiesCard = ({ title, Icon, children, onYearChange }) => (
  <div className="bg-white shadow rounded-xl p-6 relative flex flex-col w-full">
    {/* Title + icon + dropdown */}
    <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
      <h3 className="text-gray-700 font-semibold">{title}</h3>
      <div className="flex items-center gap-2">
        <select
          onChange={(e) => onYearChange?.(e.target.value)}
          className="border rounded-md px-2 py-1 text-sm"
        >
          <option>2025</option>
          <option>2024</option>
          <option>2023</option>
        </select>
        <Icon className="text-green-300 text-2xl" />
      </div>
    </div>

    <div className="w-full">{children}</div>
  </div>
);

// Pie Chart style
export const PieCard = ({ title, Icon, chart, legend, pill }) => (
  <div className="bg-white shadow rounded-xl px-4 py-5 relative w-full ">
    {/* Title + icon */}
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-gray-900 font-semibold text-xl">{title}</h3>
      <Icon className="text-green-300 text-2xl" />
    </div>

    {/* Chart + legend side by side */}
    <div className="flex gap-2 items-start flex-wrap  sm:flex-nowrap  justify-center overflow-hiddens">
      <div className="w-full md:min-w-[70%]  ">{chart}</div>
      <div className="flex flex-col gap-2 w-full md:w-[40%]">{legend}</div>
      <div className="flex flex-col gap-2 w-full md:w-[40%]">{pill}</div>
    </div>
  </div>
);


