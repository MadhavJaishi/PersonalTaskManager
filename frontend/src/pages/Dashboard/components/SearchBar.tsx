import { useState } from "react";
import Modal from "../../../components/Modal";
import AddTask from "./AddTask";

const SearchBar = () => {
    const [addTaskOpen, setAddTaskOpen] = useState(false);
    return (
        <div className="w-full md:w-3/6 mx-auto flex items-center gap-2 p-2 rounded-2xl bg-white border border-gray-300 shadow-sm">
            <input
                type="text"
                placeholder="Hello World, Check this out !!"
                className="flex-grow px-4 py-2 rounded-xl focus:outline-none"
            />
            <button onClick={() => setAddTaskOpen(true)} className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-3xl">
                Add Task
            </button>


            {addTaskOpen && <Modal isOpen={addTaskOpen} setIsOpen={setAddTaskOpen} title={"Add Task"} ><AddTask setIsOpen={setAddTaskOpen} /> </Modal>}
        </div>
    );
};


export default SearchBar