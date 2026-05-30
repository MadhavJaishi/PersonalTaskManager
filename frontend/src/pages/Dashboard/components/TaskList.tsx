import { MdDelete } from "react-icons/md";
import PriorityTooltip from "./PriorityTooltip";
import { useDrop } from 'react-dnd';
import { useEffect, useRef, useState } from 'react';
import { ItemTypes } from './Presets';
import { addTaskAsync, colorENUM, deleteTaskAsync, fetchTaskList, updateTask, type Task } from "../redux/tasklist";
import { useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import SearchBar from "./SearchBar";
import { useSelector } from "react-redux";

const TaskList = () => {
    const ref = useRef<HTMLDivElement>(null);
    const taskList = useSelector((state: RootState) => state.tasklistSliceReducer.tasks)
    const userId = useSelector((state: RootState) => state.userSliceReducer.id)
    console.log("TAsklits", taskList)
    const [idCnt, setIdCnt] = useState(16);
    const dispatch = useDispatch<AppDispatch>();
    const [, drop] = useDrop(() => ({
        accept: ItemTypes.PRESET,
        drop: (item: Task) => {
            const newTask = { ...item, id: idCnt };
            dispatch(addTaskAsync(newTask));
            setIdCnt((prev) => prev + 1);
        },
    }));
    drop(ref);

    useEffect(() => {
        dispatch(fetchTaskList({ userId: userId! }));
    }, [])

    const handleTaskDelete = (taskId: number) => {
        dispatch(deleteTaskAsync(taskId));
    }
    return (
        <div className="text-black bg-white rounded-xl mx-auto p-4">
            <div className="mb-4 flex flex-row gap-5 justify-between align-middle px-8">
                <h2 className="text-2xl font-semibold">Task List</h2>

                <SearchBar />

                <div>
                    <PriorityTooltip />
                </div>
            </div>

            <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 rounded-2xl h-auto min-h-[480px] scrollbar-hide">
                {taskList && taskList.map((item) => (
                    <div
                        key={item.id}
                        className={`
                      flex flex-col w-90 p-4 rounded-2xl text-zinc-800
                      shadow
                      transition-transform duration-300
                      hover:scale-104 origin-top
                      hover:shadow-lg h-50
                      ${colorENUM[item.priority as keyof typeof colorENUM]}
                    `}
                    >

                        <div className="flex flex-row justify-between items-center relative mb-2">
                            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                            <div className="absolute top-10 right-0" onClick={() => handleTaskDelete(item.id)}><MdDelete size={28} color="rose" /></div>
                        </div>
                        <div>
                            <p className="mb-2">{item.description}</p>
                        </div>
                        <div className="flex flex-row gap-4 mb-2">
                            <p>Target: {Math.floor(item.targetDuration / 60)} minutes</p>
                            <p>Priority: P{item.priority}</p>
                        </div>
                        <div className="flex items-center gap-4 text-gray-800">
                            <h1>Time Spent :</h1>
                            <input
                                type="text"
                                placeholder="HH:MM"
                                value={`${Math.floor(item.timeSpent / 3600)
                                    .toString()
                                    .padStart(2, "0")}:${Math.floor((item.timeSpent % 3600) / 60)
                                        .toString()
                                        .padStart(2, "0")}`}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    // Validate format HH:MM
                                    const match = val.match(/^(\d{1,2}):(\d{2})$/);
                                    if (match) {
                                        const hours = parseInt(match[1], 10);
                                        const minutes = parseInt(match[2], 10);
                                        if (minutes < 60) {
                                            const seconds = hours * 3600 + minutes * 60;
                                            dispatch(updateTask({ ...item, timeSpent: seconds }));
                                        }
                                    }
                                }}
                                className="border w-20 pl-3 border-gray-300 rounded-md px-1 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};


export default TaskList