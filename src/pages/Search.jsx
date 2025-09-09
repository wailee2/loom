// src/pages/Search.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getProfileByUsername } from "../api/accounts";
import { useNavigate } from "react-router-dom";
import SearchResults from "./SearchResults";

const Search = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    try {
      setLoading(true);
      setError(null);
      const profile = await getProfileByUsername(query, accessToken);
      setResults([profile]);
    } catch (err) {
      if (err.message.includes("404")) {
        // Redirect to Page Not Found instead of showing error
        navigate("/page-not-found");
      } else {
        setError(err.message);
        setResults([]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSearch} className="flex mb-4">
        <input
          type="text"
          placeholder="Search by username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-r-md hover:bg-green-600"
        >
          Search
        </button>
      </form>

      {loading && <p>Searching...</p>}
      {!loading && !error && results.length > 0 && (
        <SearchResults results={results} />
      )}
      {!loading && !error && results.length === 0 && query && (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default Search;
