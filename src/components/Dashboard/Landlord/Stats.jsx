import React from "react";
import landlordData from "../../../data/landlord/landlordData";
import {
  FaDollarSign,
  FaHome,
  FaClipboardList,
  FaWallet,
  FaTools,
  FaStar,
  FaUsers,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Stats() {
  const {
    earnings,
    occupancies,
    properties,
    applications,
    rentPayments,
    maintenanceRequests,
    reviews,
  } = landlordData;

  // ---- Aggregates ----
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "N/A";

  // Applications status counts
  const applicationCounts = [
    { name: "Approved", value: applications.filter(a => a.status === "Approved").length, color: "#3B82F6" }, // blue
    { name: "Declined", value: applications.filter(a => a.status === "Declined").length, color: "#9333EA" }, // purple
    { name: "Pending", value: applications.filter(a => a.status === "Pending").length, color: "#FACC15" }, // yellow
  ];

  // Rent payments status counts
  const rentCounts = [
    { name: "Paid", value: rentPayments.filter(r => r.status === "Paid").length, color: "#14B8A6" }, // teal
    { name: "Scheduled", value: rentPayments.filter(r => r.status === "Scheduled").length, color: "#EC4899" }, // pink
  ];

  const statsData = [
    {
      id: "earnings",
      title: "Earnings",
      value: `₦${earnings.thisMonth.toLocaleString()}`,
      subtext: `Last month ₦${earnings.lastMonth.toLocaleString()}`,
      icon: <FaDollarSign className="text-green-600 text-xl" />,
      chartType: "bar",
      chartData: earnings.monthlyTrend,
      chartKey: "value",
      chartColor: "#3B82F6", // blue-500
    },
    {
      id: "occupancies",
      title: "Occupancies",
      value: `${occupancies.occupied}/${occupancies.total}`,
      subtext: `${occupancies.vacant} vacant`,
      icon: <FaUsers className="text-blue-600 text-xl" />,
      chartType: "bar",
      chartData: occupancies.trend,
      chartKey: "occupied",
      chartColor: "#FACC15", // yellow
    },
    {
      id: "properties",
      title: "Properties Sold",
      value: properties.thisYear,
      subtext: `${properties.lastYear} last year, ${properties.twoYearsAgo} two years ago`,
      icon: <FaHome className="text-purple-600 text-xl" />,
      chartType: "bar",
      chartData: [
        { year: "2023", value: properties.twoYearsAgo, fill: "#FDE68A" }, // yellow-200
        { year: "2024", value: properties.lastYear, fill: "#FDE68A" },
        { year: "2025", value: properties.thisYear, fill: "#CA8A04" }, // yellow-600
      ],
      chartKey: "value",
    },
    {
      id: "applications",
      title: "Applications",
      value: applications.length,
      subtext: "Status distribution",
      icon: <FaClipboardList className="text-orange-600 text-xl" />,
      chartType: "pie",
      chartData: applicationCounts,
    },
    {
      id: "rentPayments",
      title: "Rent Payments",
      value: rentPayments.length,
      subtext: "Paid vs Scheduled",
      icon: <FaWallet className="text-teal-600 text-xl" />,
      chartType: "pie",
      chartData: rentCounts,
    },
    {
      id: "maintenanceRequests",
      title: "Maintenance",
      value: maintenanceRequests.length,
      subtext: "Open requests",
      icon: <FaTools className="text-red-600 text-xl" />,
    },
    {
      id: "reviews",
      title: "Reviews",
      value: avgRating,
      subtext: "Average rating",
      icon: <FaStar className="text-yellow-500 text-xl" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {statsData.map((stat) => (
        <div
          key={stat.id}
          className="bg-white rounded-2xl shadow-md p-5 relative"
        >
          {/* Icon (top right) */}
          <div className="absolute top-4 right-4">{stat.icon}</div>

          {/* Title & Value */}
          <h3 className="text-sm text-gray-500 font-medium">{stat.title}</h3>
          <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          <p className="text-xs text-gray-500">{stat.subtext}</p>

          {/* Charts */}
          {stat.chartType === "bar" && (
            <div className="h-32 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stat.chartData}>
                  <XAxis dataKey="month" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Bar
                    dataKey={stat.chartKey}
                    fill={stat.chartColor || (d => d.fill)}
                    radius={6}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {stat.chartType === "pie" && (
            <div className="h-40 mt-3 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stat.chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    innerRadius={30}
                    paddingAngle={3}
                  >
                    {stat.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              {/* Orbiting values */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-wrap gap-2 justify-center">
                  {stat.chartData.map((entry, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shadow"
                      style={{ backgroundColor: entry.color }}
                    >
                      {entry.value}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
