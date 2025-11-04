import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTaskAsync, Task } from "../../../redux/tasklist";
import { AppDispatch } from "../../../redux/store";

const AddTaskOrPreset = ({ setIsOpen, itemName }: { setIsOpen: (isOpen: boolean) => void; itemName: string; }) => {
    const dispatch = useDispatch<AppDispatch>();
    const initialData: Task = {
        id: 0,
        title: "",
        description: "",
        targetDuration: 0, // in seconds
        notes: "",
        priority: null,
    }
    const [taskData, setTaskData] = useState<Task>(initialData);
    const handleChange = (name: string, value: string | number) => {
        setTaskData({ ...taskData, [name]: value });
    }
    const addTask = async () => {
        try {
            await dispatch(addTaskAsync(taskData));
        } catch (error) {
            console.error("Error adding task:", error);
        }
    }
    const addPreset = async () => {
        try {
            await dispatch(addTaskAsync(taskData));
        } catch (error) {
            console.error("Error adding task:", error);
        }
    }
    return (
        <form className={`space-y-4 ${taskData?.priority}`}>
            <div className="flex flex-row align-middle justify-between">
                <h2 className="text-2xl font-bold mb-4">Add {itemName}</h2>
                <button onClick={() => setIsOpen(false)} className="float-right text-4xl text-gray-500 hover:text-gray-700">
                    &times;
                </button>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">{itemName} Name</label>
                <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter task name"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter task description"
                ></textarea>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Estimated Duration (minutes)</label>
                <input
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter estimated duration"
                    onChange={(e) => handleChange("targetDuration", Number(e.target.value) * 60)}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2  focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) => handleChange("priority", e.target.value)}
                >
                    <option value="null">Select</option>
                    <option value="0">None</option>
                    <option value="1">Low</option>
                    <option value="2">Medium</option>
                    <option value="3">High</option>
                </select>
            </div>
            {itemName === "task" &&
                <div>

                </div>
            }
            <div className="flex justify-end mt-4">
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="mr-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    onClick={itemName === "Task" ? addTask : addPreset}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                >
                    Add {itemName}
                </button>
            </div>
        </form>
    )
}

export default AddTaskOrPreset