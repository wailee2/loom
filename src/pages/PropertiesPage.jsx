// src/pages/PropertiesPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { formatPrice } from "../utils/formatPrice";
import { getAllProperties } from "../api/property";
import { useHandle404Redirect } from "../utils/handleErrors";
import HandleLoading from "../utils/HandleLoading";
import { HiLocationMarker } from "react-icons/hi";

const PropertiesPage = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const handle404 = useHandle404Redirect();

    useEffect(() => {
      const fetchProperties = async () => {
        try {
          setLoading(true);
          const data = await getAllProperties();
          setProperties(data);
        } catch (err) {
          handle404(err);
        } finally {
          setLoading(false);
        }
      };

      fetchProperties();
    }, [handle404]);

    return (
      <HandleLoading loading={loading}>
        <div className="py-4 pr-4 md:pl-1.5 p-4 bg-white space-y-3">
          <Header />
          <div className="og-bg">
            <h1 className="text-4xl font-semibold og-p">Properties</h1>
            <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 og-bg ">
              
              {properties.length === 0 ? (
                
                <p>No properties available.</p>
                ) : (
                properties.map((property) => (
                  <div
                    key={property.id}
                    className="rounded-2xl p-3 shadow transition flex flex-col justify-between bg-white space-y-3"
                  >
                    <div className="rounded-xl w-full h-38 bg-gray-200 flex items-center justify-center overflow-hidden">
                      {property.image}
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <h2 className="text-sm font-semibold">
                          {property.title.length > 15 ? `${property.title.slice(0, 15)}...` : property.title}
                        </h2>
                        <p className="text-gray-600 flex items-center text-sm gap-1">
                          <HiLocationMarker />{' '}
                          {property.location.length > 15 ? `${property.location.slice(0, 15)}...` : property.location}
                        </p>
                      </div>

                      
                      <p className="text-green-700 font-semibold text-lg">
                        ${formatPrice(property.price, { thousand: 1000, million: 1_000_000, decimals: 1 })}
                      </p>
                    </div>

                    <Link
                      to={`/properties/${property.id}`} // dynamically link to property details page
                      className=" inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                      View Details
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </HandleLoading>
    );
};

export default PropertiesPage;