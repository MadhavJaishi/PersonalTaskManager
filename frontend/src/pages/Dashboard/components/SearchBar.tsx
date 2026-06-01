import { useState } from "react";
import Modal from "../../../components/Modal";
import AddTaskOrPreset from "./AddTaskOrPreset";

const SearchBar = () => {
    const [addTaskOpen, setAddTaskOpen] = useState(false);
    return (
        <div className="w-full max-w-3xl mx-auto flex items-center bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
            <input
                type="text"
                placeholder="What needs to be done?"
                className="flex-1 px-5 py-1 text-gray-700 outline-none"
            />

            <button
                onClick={() => setAddTaskOpen(true)}
                className="m-2 px-5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
            >
                Add Task
            </button>

            {addTaskOpen && <Modal isOpen={addTaskOpen} setIsOpen={setAddTaskOpen} title={"Add Task"} ><AddTaskOrPreset setIsOpen={setAddTaskOpen} itemName="Task" /> </Modal>}
        </div>
    );
};


export default SearchBar