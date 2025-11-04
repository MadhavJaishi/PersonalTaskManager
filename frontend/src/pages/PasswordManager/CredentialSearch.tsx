import { useState } from "react";
import { IoMdSearch } from "react-icons/io";

const CredentialSearch = () => {
    return (
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-2xl bg-white border border-gray-300 shadow-sm">
            <IoMdSearch size={24} className="" />
            <input
                type="text"
                placeholder="Search Credentials..."
                className="flex-grow px-4 py-1 rounded-xl focus:outline-none"
            />
        </div>
    );
};


export default CredentialSearch