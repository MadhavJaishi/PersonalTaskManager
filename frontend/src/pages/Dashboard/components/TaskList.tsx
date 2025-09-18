import { MdDelete } from "react-icons/md";
import PriorityTooltip from "./PriorityTooltip";
import TaskClock from "./TaskClock";
import { useDrop } from 'react-dnd';
import { useRef, useState } from 'react';
import { ItemTypes } from './Presets';
import { colorENUM, type Task } from "../../../redux/tasklist";

const temp: Task[] = [
    { id: 1, title: "Clean the room and take out trash from dustbin", description: "Do sweeping, and clean the kitchen", targetDuration: 200, notes: "", priority: "3" },
    { id: 2, title: "Take class of Cohort2.0", description: "Complete 2 videos", targetDuration: 3600, notes: "I have read of typescript today", priority: "2" },
    { id: 3, title: "Grocery shopping", description: "Buy milk, eggs, and bread", targetDuration: 1800, notes: "Check for discounts", priority: "1" },
    { id: 4, title: "Workout", description: "30 minutes cardio, 20 minutes strength", targetDuration: 3000, notes: "Don't skip stretching", priority: "0" },
    // { id: 5, title: "Read a book", description: "Read 20 pages of a novel", targetDuration: 2400, notes: "Focus on fiction", priority: "3" },
    // { id: 6, title: "Write blog post", description: "Draft an article on productivity", targetDuration: 4200, notes: "Include personal anecdotes", priority: "2" },
    // { id: 7, title: "Learn piano", description: "Practice scales and a new song", targetDuration: 3600, notes: "Keep tempo steady", priority: "3" },
    // { id: 8, title: "Call parents", description: "Catch up with family", targetDuration: 900, notes: "Ask about their weekend plans", priority: "1" },
    // { id: 9, title: "Plan meals", description: "Decide lunch and dinner for 3 days", targetDuration: 1200, notes: "Try a new recipe", priority: "0" },
    // { id: 10, title: "Update resume", description: "Add recent projects", targetDuration: 1800, notes: "Double-check formatting", priority: "2" },
    // { id: 11, title: "Write blog post", description: "Draft an article on productivity", targetDuration: 4200, notes: "Include personal anecdotes", priority: "3" },
    // { id: 12, title: "Learn piano", description: "Practice scales and a new song", targetDuration: 3600, notes: "Keep tempo steady", priority: "3" },
    // { id: 13, title: "Call parents", description: "Catch up with family", targetDuration: 900, notes: "Ask about their weekend plans", priority: "2" },
    // { id: 14, title: "Plan meals", description: "Decide lunch and dinner for 3 days", targetDuration: 1200, notes: "Try a new recipe", priority: "1" },
    // { id: 15, title: "Update resume", description: "Add recent projects", targetDuration: 1800, notes: "Double-check formatting", priority: "0" },
];

const TaskList = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [data, setData] = useState(temp);
    const [idCnt, setIdCnt] = useState(16);
    const [, drop] = useDrop(() => ({
        accept: ItemTypes.PRESET,
        drop: (item: Task) => {
            const newTask = { ...item, id: idCnt }; // Create new task from preset
            setData((prev) => [...prev, newTask]);
            setIdCnt((prev) => prev + 1);
        },
    }));
    drop(ref);
    const handleTaskDelete = (taskId: number) => {
        const updatedData = data.filter((item) => item.id !== taskId);
        setData(updatedData);
        // alert(
        //     "Delete Task",
        //     "Are you sure you want to delete this task?",
        //     [
        //         {
        //             text: "Cancel",
        //             style: "cancel"
        //         },
        //         {
        //             text: "Delete",
        //             style: "destructive",
        //             onPress: () => {
        //                 const updatedData = data.filter((item) => item.id !== taskId);
        //                 setData(updatedData);
        //             }
        //         }
        //     ]
        // );
    }
    return (
        <div className="text-black bg-white rounded-xl mx-auto p-4">
            <div className="mb-4 flex flex-row gap-5 justify-between px-8">
                <h2 className="text-2xl font-semibold">Task List</h2>

                <div>
                    <PriorityTooltip />
                </div>
            </div>

            <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-2xl h-auto min-h-[480px] scrollbar-hide">
                {data.map((item) => (
                    <div
                        key={item.id}
                        className={`
                      flex flex-col w-100 p-4 rounded-2xl text-zinc-800
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
                        <TaskClock />
                    </div>
                ))}
            </div>
        </div>
    );
};


export default TaskList