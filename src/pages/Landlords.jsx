// pages/Landlords.jsx
//this is page is a list of landlords
import React, { useEffect, useState } from "react";
import { getLandlords } from "../api/accounts";
import { useAuth } from "../context/AuthContext";
import { useHandle404Redirect } from "../utils/handleErrors";
import HandleLoading from "../utils/HandleLoading";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

const Landlords = () => {
  const { accessToken } = useAuth();
  const [landlords, setLandlords] = useState([]);
  const [loading, setLoading] = useState(true);
  const handle404 = useHandle404Redirect();

  useEffect(() => {
    const fetchLandlords = async () => {
      try {
        const data = await getLandlords(accessToken);
        setLandlords(data);
      } catch (err) {
        handle404(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLandlords();
  }, [accessToken, handle404]);

   return (
    <HandleLoading loading={loading}>
      <div>
        <div className="og-bg og-p space-y-7">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-semibold">All Landlords</h1>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="mt-1.5 w-5 h-5 text-gray-600 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>List of landlords.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {landlords.length === 0 ? (
            <p className="text-gray-500">No landlords found.</p>
          ) : (
            <ul className="space-y-3">
              {landlords.map((landlord) => (
                <li
                  key={landlord.id}
                  className="p-4 rounded-lg shadow-sm bg-white"
                >
                  <h2 className="text-lg font-semibold">{landlord.first_name} {landlord.last_name}</h2>
                  <p className="text-gray-600">{landlord.email}</p>
                  <p className="text-gray-600">{landlord.phone_number}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </HandleLoading>
  );
};

export default Landlords;
