// src/components/Header.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { LucideSearch, MessageCircle, NotepadTextIcon } from "lucide-react";
import { getProfileByUsername } from "../api/accounts";

const Header = ({ handle404 }) => {
    const { user, accessToken } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery) return;

        try {
        await getProfileByUsername(searchQuery, accessToken);
        navigate(`/profile/${searchQuery}`);
        } catch (err) {
        handle404(err);
        } finally {
        setSearchQuery("");
        }
    };

    return (
        <header className="og-bg og-p og-flex flex-wrap">
            {/* SEARCHBAR */}
            <div>
                <form
                onSubmit={handleSearch}
                className="flex max-w-[20rem] px-4 rounded-full bg-white"
                >
                <div className="text-gray-900 rounded-r-md flex items-center">
                    <LucideSearch className="w-5 h-5" />
                </div>
                <input
                    type="text"
                    placeholder="Search by username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 py-3.5 px-3 bg-white text-sm focus:outline-none"
                />
                </form>
            </div>
            {user && (
            <div className="flex justify-between items-center gap-3">
                <Link to="/messages" className="p-3.5 bg-white rounded-full">
                <MessageCircle className="w-5 h-5 text-gray-900" />
                </Link>

                <div className="p-3.5 bg-white rounded-full">
                <NotepadTextIcon className="w-5 h-5 text-gray-900" />
                </div>

                <Link
                    to="/profile"
                    className="flex items-center justify-between group gap-3"
                    >
                    <div className="bg-white rounded-full p-6.5 group-hover:bg-gray-900 transition-all duration-800 linear"></div>
                    <div className="hidden md:block">
                        <div className="flex flex-col items-start justify-center">
                            <span className="text-[19px] font-semibold truncate max-w-[130px]">
                            {user?.first_name}
                            </span>
                            <span className="text-sm text-gray-500 truncate max-w-[130px]">
                            {user?.email}
                            </span>
                        </div>
                    </div>
                </Link>
            </div>
            )}
        </header>
    );
};

export default Header;
