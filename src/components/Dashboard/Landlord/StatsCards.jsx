// components/StatsCards.jsx
import React from "react";

// Earnings & Occupation style
export const ValueCard = ({ title, value, subtext, Icon, iconColor, iconbGColor, children }) => (
  <div className="bg-white shadow rounded-xl p-4.5 relative flex flex-col w-full ">
    {/* Top row: value + title left, icon right */}
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-[26px] font-bold">{value}</p>
        <p className="text-gray-700 text-[14px]">{title}</p>
      </div>
    </div>

    <div className="absolute rounded-full p-2 -top-2.5 -right-2.5 bg-gray-100">
        <div className="bg-white rounded-full p-2">
            <div className={`${iconbGColor} rounded-full p-1.5`}>
                <Icon className={`${iconColor} text-xl`} />
            </div>
        </div>
    </div>

    {/* Bottom row: subtext left, chart right */}
    <div className="flex justify-between items-end gap-4 ">
        <div className="w-1/3">
            {subtext && <p className="text-gray-700 text-sm w-full">{subtext}</p>}
        </div>
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
export const PieCard = ({ title, Icon, iconColor, iconbGColor, chart, legend, pill }) => (
  <div className="bg-white shadow rounded-2xl p-4.5 relative w-full">
    {/* Title + icon */}
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-gray-900 font-semibold text-xl">{title}</h3>
    </div>

    <div className="absolute rounded-full p-2 -top-2.5 -right-2.5 bg-gray-100">
        <div className="bg-white rounded-full p-2">
            <div className={`${iconbGColor} rounded-full p-1.5`}>
                <Icon className={`${iconColor} text-xl`} />
            </div>
        </div>
    </div>

    {/* Chart + legend side by side */}
    <div className="flex space-y-5 md:gap-2 items-start flex-wrap  sm:flex-nowrap  justify-center">
      <div className="w-full md:min-w-[70%]">{chart}</div>
      <div className="flex flex-wrap justify-around  md:flex-col gap-2 w-full md:w-[40%]">{legend}</div>
      <div className="flex flex-col gap-2 w-full md:w-[40%]">{pill}</div>
    </div>
  </div>
);


