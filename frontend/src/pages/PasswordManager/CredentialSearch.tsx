import React from "react";
import { IoMdSearch } from "react-icons/io";

interface CredentialSearchProps {
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
}

const CredentialSearch: React.FC<CredentialSearchProps> = ({ searchQuery = "", onSearchChange }) => {
    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm w-full sm:w-72">
            <IoMdSearch size={22} className="text-slate-400 shrink-0" />
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                placeholder="Search credentials..."
                className="w-full text-slate-700 font-medium placeholder-slate-400 outline-none text-sm bg-transparent"
            />
        </div>
    );
};

export default CredentialSearch;