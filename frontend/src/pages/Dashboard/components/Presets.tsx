import { useDrag } from 'react-dnd';
import { type Task } from '../../../redux/tasklist'
import { useRef } from 'react';
const data: Task[] = [
    { id: 1, title: "Clean the room", description: "Do sweeping, and clean the kitchen", targetDuration: 200, notes: "", priority: "3" },
    { id: 2, title: "Take class of Cohort2.0", description: "Complete 2 videos", targetDuration: 3600, notes: "I have read of typescript today", priority: "1" },
    { id: 3, title: "Grocery shopping", description: "Buy milk, eggs, and bread", targetDuration: 1800, notes: "Check for discounts", priority: "2" },
    { id: 4, title: "Workout", description: "30 minutes cardio, 20 minutes strength", targetDuration: 3000, notes: "Don't skip stretching", priority: "0" },
    { id: 5, title: "Read a book", description: "Read 20 pages of a novel", targetDuration: 2400, notes: "Focus on fiction", priority: "1" },
    { id: 6, title: "Write blog post", description: "Draft an article on productivity", targetDuration: 4200, notes: "Include personal anecdotes", priority: "2" },
    { id: 7, title: "Learn piano", description: "Practice scales and a new song", targetDuration: 3600, notes: "Keep tempo steady", priority: "3" },
    { id: 8, title: "Call parents", description: "Catch up with family", targetDuration: 900, notes: "Ask about their weekend plans", priority: "0" },
    { id: 9, title: "Plan meals", description: "Decide lunch and dinner for 3 days", targetDuration: 1200, notes: "Try a new recipe", priority: "2" },
    { id: 10, title: "Update resume", description: "Add recent projects", targetDuration: 1800, notes: "Double-check formatting", priority: "1" },
    { id: 11, title: "Write blog post", description: "Draft an article on productivity", targetDuration: 4200, notes: "Include personal anecdotes", priority: "2" },
    { id: 12, title: "Learn piano", description: "Practice scales and a new song", targetDuration: 3600, notes: "Keep tempo steady", priority: "3" },
    { id: 13, title: "Call parents", description: "Catch up with family", targetDuration: 900, notes: "Ask about their weekend plans", priority: "0" },
    { id: 14, title: "Plan meals", description: "Decide lunch and dinner for 3 days", targetDuration: 1200, notes: "Try a new recipe", priority: "2" },
    { id: 15, title: "Update resume", description: "Add recent projects", targetDuration: 1800, notes: "Double-check formatting", priority: "1" },
];

export const ItemTypes = {
    PRESET: 'preset',
};

const Presets = () => {
    return (
        <div className="bg-white text-gray-800 p-4 rounded-xl shadow overflow-y-auto">
            <div className="flex justify-between items-center mb-4 px-4">
                <h2 className="text-2xl font-semibold">Preset Tasks</h2>
                <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                    + Add Presets
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl h-180 overflow-y-auto scrollbar-hide">
                {data.map((task) => (
                    <DraggablePreset key={task.id} preset={task} />
                ))}
            </div>
        </div>
    );
};

const DraggablePreset = ({ preset }: { preset: Task }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [, drag] = useDrag(() => ({
        type: ItemTypes.PRESET,
        item: preset,
    }));
    drag(ref);

    return (
        <div
            ref={ref}
            key={preset.id}
            className="cursor-move flex flex-col p-4 shadow rounded-2xl text-zinc-700 bg-teal-50
        transition-transform duration-300
      hover:scale-102 origin-top
      hover:shadow-lg"
        >
            <h3 className="text-lg font-semibold">{preset.title}</h3>
            <p className="text-sm text-gray-600">{preset.description}</p>
            <p className="text-xs text-gray-500 mt-1">
                Estimated: {Math.floor(preset.targetDuration / 60)} mins
            </p>
        </div>
    );
};


export default Presets