import React, { useState } from "react";
import Modal from "../../../components/Modal";
import AddTaskModal from "./AddTaskModal";
import { FaPlus, FaSearch } from "react-icons/fa";

interface SearchBarProps {
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery = "", onSearchChange }) => {
    const [addTaskOpen, setAddTaskOpen] = useState(false);

    return (
        <div className="w-full max-w-3xl flex items-center bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow transition p-1.5 gap-2">
            <div className="flex items-center flex-1 px-3 py-1 gap-2 text-slate-400">
                <FaSearch className="text-slate-400 text-sm" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                    placeholder="Search tasks by title or keyword..."
                    className="w-full bg-transparent text-slate-700 font-medium placeholder-slate-400 outline-none text-sm"
                />
            </div>

            <button
                onClick={() => setAddTaskOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-sm shrink-0 cursor-pointer"
            >
                <FaPlus className="text-xs" />
                <span>Add Task</span>
            </button>

            {addTaskOpen && (
                <Modal isOpen={addTaskOpen} setIsOpen={setAddTaskOpen} title="Add Task">
                    <AddTaskModal setIsOpen={setAddTaskOpen} />
                </Modal>
            )}
        </div>
    );
};

export default SearchBar;