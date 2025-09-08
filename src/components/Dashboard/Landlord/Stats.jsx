// components/Stats.jsx
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import {
  FaDollarSign,
  FaHome,
  FaBuilding,
  FaClipboardList,
  FaMoneyBillWave,
  FaTools,
  FaStar,
} from 'react-icons/fa';

import landlordData from '../../../data/landlord/landlordData';
import { ValueCard, PropertiesCard, PieCard } from './StatsCards';

const Stats = () => {
  const {
    earnings,
    occupancies,
    properties,
    applications,
    rentPayments,
    maintenanceRequests,
    reviews
  } = landlordData;

  const averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);

  const latestOccupancy = occupancies[occupancies.length - 1];
  const latestProperties = properties[properties.length - 1];

  return (
    <div className="p-6">
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6'>
        {/* Earnings */}
        <ValueCard
          title="Asset Value"
          value={`$${earnings[earnings.length - 1].amount.toLocaleString()}`}
          subtext="This year"
          Icon={FaDollarSign}
        >
          <ResponsiveContainer width="100%" height={90}>
            <BarChart data={earnings}>
              <XAxis dataKey="year" hide />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="amount" radius={[5, 5, 5, 5]} >
                {earnings.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.color === 'blue-500' ? '#3b82f6' : '#bfdbfe'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ValueCard>

        {/* Occupancies */}
        <ValueCard
          title="Occupancies"
          value={`${latestOccupancy.occupiedUnits}/${latestOccupancy.totalUnits}`}
          subtext="This year"
          Icon={FaHome}
          iconColor="text-[#FACC15]"
          iconbGColor="bg-[#facc1542]"
        >
          <ResponsiveContainer width="100%" height={90}>
            <BarChart data={occupancies}>
              <XAxis dataKey="year" hide />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="occupiedUnits" radius={[5, 5, 5, 5]} barSize={50}>
                {occupancies.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.color === 'yellow-500' ? '#facc15' : '#fef08a'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ValueCard>

        {/* Properties */}
        <PropertiesCard
          title="Properties"
          Icon={FaBuilding}
          onYearChange={(year) => console.log('Selected year:', year)}
        >
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={properties}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalProperties">
                {properties.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.color === 'green-500' ? '#22c55e' : '#bbf7d0'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </PropertiesCard>
      </div>
      <div
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5'
      >
        {/* Applications */}
        <PieCard
          title="Applications"
          Icon={FaClipboardList}
          iconColor="text-[#8B5CF6]"
          iconbGColor="bg-[#8a5cf662]"
          chart={
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <circle
                  cx="50%"
                  cy="50%"
                  r={75}
                  stroke="#333"
                  strokeWidth={1}
                  fill="none"
                />
                <Pie
                  data={applications}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={3}
                  cornerRadius={7}
                >
                  {applications.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          }
          
          legend={applications.map(r => (
            <div key={r.status} className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full border-black" style={{ background: r.color + 84 }} />
              <div>
                <div className="text-[10.5px] text-gray-500">{r.status}</div>
                <div className="text-[14px] text-gray-800 font-bold">{r.count}</div>
              </div>
            </div>
          ))}
        />

        {/* Rent Payments */}
       <PieCard
          title="Rent Payments"
          Icon={FaMoneyBillWave}
          iconColor="text-[#14b8a6]"
          iconbGColor="bg-[#14b8a527]"
          chart={
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <circle
                  cx="50%"
                  cy="50%"
                  r={75}
                  stroke="#333"
                  strokeWidth={1}
                  fill="none"
                />
                <Pie
                  data={rentPayments}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={3}
                  cornerRadius={7}
                >
                  {rentPayments.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          }
          
          legend={rentPayments.map(r => (
            <div key={r.status} className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full border-black" style={{ background: r.color + 84 }} />
              <div>
                <div className="text-[10.5px] text-gray-500">{r.status}</div>
                <div className="text-[14px] text-gray-800 font-bold">{r.count}</div>
              </div>
            </div>
          ))}
        />

        {/* Maintenance */}
        <PieCard
          title="Maintanance"
          Icon={FaTools}
          iconColor="text-[#FACC15]"
          iconbGColor="bg-[#facc1542]"
          chart={
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <circle
                  cx="50%"
                  cy="50%"
                  r={75}
                  stroke="#333"
                  strokeWidth={1}
                  fill="none"
                />
                <Pie
                  data={maintenanceRequests}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={3}
                  cornerRadius={7}
                >
                  {maintenanceRequests.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          }
          
          legend={maintenanceRequests.map(r => (
            <div key={r.status} className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full border-black" style={{ background: r.color + 84 }} />
              <div>
                <div className="text-[10.5px] text-gray-500">{r.status}</div>
                <div className="text-[14px] text-gray-800 font-bold">{r.count}</div>
              </div>
            </div>
          ))}
        />
      </div>

      {/* Reviews */}
      <ValueCard
        title="Reviews"
        value={averageRating}
        subtext="Average rating"
        Icon={FaStar}
      >
        <div className="text-gray-500 text-sm mt-2 space-y-1">
          {reviews.map((r, i) => (
            <p key={i}>
              <strong>{r.reviewer}:</strong> {r.rating}⭐ - {r.comment}
            </p>
          ))}
        </div>
      </ValueCard>

    </div>
  );
};

export default Stats;
