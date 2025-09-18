import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTaskAsync, Task } from "../../../redux/tasklist";
import { AppDispatch } from "../../../redux/store";

const AddTask = ({ setIsOpen }: { setIsOpen: (isOpen: boolean) => void; }) => {
    const dispatch = useDispatch<AppDispatch>();
    const initialData: Task = {
        id: 0,
        title: "",
        description: "",
        targetDuration: 0, // in seconds
        notes: "",
        priority: "0",
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
    return (
        <form className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Task Name</label>
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
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                    type="date"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
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
                    onClick={addTask}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                >
                    Add Task
                </button>
            </div>
        </form>
    )
}

export default AddTask