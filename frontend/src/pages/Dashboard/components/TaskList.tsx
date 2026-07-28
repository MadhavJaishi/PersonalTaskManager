import { useState, useEffect } from "react";
import { MdDelete, MdEdit, MdCheckCircle, MdRadioButtonUnchecked } from "react-icons/md";
import PriorityTooltip from "./PriorityTooltip";
import { deleteTaskAsync, fetchTaskList, toggleTaskAsync, updateTask, colorENUM, type Task } from "../redux/tasklist";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import SearchBar from "./SearchBar";
import Modal from "../../../components/Modal";
import AddTaskModal from "./AddTaskModal";
import AlertModal, { AlertModalProps } from "../../../components/AlertModal";

const TaskList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const taskList = useSelector((state: RootState) => state.tasklistSliceReducer.tasks);
    const loading = useSelector((state: RootState) => state.tasklistSliceReducer.loading);
    const userId = useSelector((state: RootState) => state.userSliceReducer.id);

    const [priorityFilter, setPriorityFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [alertModal, setAlertModal] = useState<AlertModalProps>({
        visible: false,
        title: "",
        message: "",
        buttons: [],
    });

    useEffect(() => {
        dispatch(fetchTaskList({ userId: userId || undefined }));
    }, [dispatch, userId]);

    const filteredTasks = (taskList || []).filter((item) => {
        // Priority Filter
        if (priorityFilter !== "All") {
            const match = priorityFilter.match(/\d+/);
            const targetP = match ? match[0] : priorityFilter;
            if (String(item.priority) !== String(targetP)) return false;
        }
        // Search Filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const titleMatch = item.title?.toLowerCase().includes(query);
            const descMatch = item.description?.toLowerCase().includes(query);
            if (!titleMatch && !descMatch) return false;
        }
        return true;
    });

    const handleToggleComplete = (taskId: number | string) => {
        dispatch(toggleTaskAsync(taskId));
    };

    const handleDeleteTask = (taskId: number | string) => {
        setAlertModal({
            visible: true,
            title: "Delete Task",
            message: "Are you sure you want to delete this task? This action cannot be undone.",
            buttons: [
                {
                    text: "Cancel",
                    onClick: () => setAlertModal((prev) => ({ ...prev, visible: false })),
                },
                {
                    text: "Delete",
                    onClick: () => {
                        dispatch(deleteTaskAsync(taskId));
                        setAlertModal((prev) => ({ ...prev, visible: false }));
                    },
                },
            ],
        });
    };

    const handleUpdateTaskSave = (updatedTask: Task) => {
        dispatch(updateTask(updatedTask));
        setEditingTask(null);
    };

    return (
        <div className="text-slate-800 rounded-2xl mx-auto p-4 w-full max-w-6xl">
            {/* Filter and Search Bar Header */}
            <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 shrink-0">
                    Tasks <span className="text-sm font-normal text-slate-500">({filteredTasks.length})</span>
                </h2>

                <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

                <PriorityTooltip selected={priorityFilter} onChange={setPriorityFilter} />
            </div>

            {/* Task Grid */}
            {loading && taskList.length === 0 ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
            ) : filteredTasks.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm my-6">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                        ✓
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">No tasks found</h3>
                    <p className="text-slate-400 text-sm max-w-md mx-auto">
                        {searchQuery || priorityFilter !== "All"
                            ? "Try adjusting your priority filter or search query."
                            : "You don't have any tasks scheduled. Click 'Add Task' to get started!"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredTasks.map((item) => {
                        const isCompleted = Boolean(item.is_completed);
                        const priorityKey = (item.priority !== null && item.priority !== undefined ? String(item.priority) : '0') as keyof typeof colorENUM;
                        const bgStyle = colorENUM[priorityKey] || colorENUM['0'];

                        const targetMins = Math.round((item.targetDuration || 0) / 60);
                        const timeSpentFormatted = `${Math.floor((item.timeSpent || 0) / 3600)
                            .toString()
                            .padStart(2, "0")}:${Math.floor(((item.timeSpent || 0) % 3600) / 60)
                            .toString()
                            .padStart(2, "0")}`;

                        return (
                            <div
                                key={item.id}
                                className={`
                                    flex flex-col justify-between p-5 rounded-2xl border backdrop-blur-sm
                                    shadow-sm hover:shadow-md transition-all duration-200 relative
                                    ${bgStyle}
                                    ${isCompleted ? 'opacity-65 grayscale-[30%]' : ''}
                                `}
                            >
                                {/* Header: Checkbox, Title, Edit/Delete */}
                                <div>
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                        <div className="flex items-start gap-2.5 flex-1">
                                            <button
                                                onClick={() => handleToggleComplete(item.id)}
                                                className="mt-1 text-xl text-blue-600 hover:text-blue-700 transition shrink-0 cursor-pointer"
                                                title={isCompleted ? "Mark incomplete" : "Mark completed"}
                                            >
                                                {isCompleted ? (
                                                    <MdCheckCircle className="text-emerald-600 text-2xl" />
                                                ) : (
                                                    <MdRadioButtonUnchecked className="text-slate-400 hover:text-blue-600 text-2xl" />
                                                )}
                                            </button>

                                            <h3 className={`text-lg font-bold text-slate-800 leading-tight ${isCompleted ? 'line-through text-slate-500' : ''}`}>
                                                {item.title}
                                            </h3>
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                            <button
                                                onClick={() => setEditingTask(item)}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white/80 rounded-lg transition"
                                                title="Edit Task"
                                            >
                                                <MdEdit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTask(item.id)}
                                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white/80 rounded-lg transition"
                                                title="Delete Task"
                                            >
                                                <MdDelete size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {item.description && (
                                        <p className="text-slate-600 text-sm mb-3 line-clamp-2 pl-8">
                                            {item.description}
                                        </p>
                                    )}
                                </div>

                                {/* Details & Time Spent */}
                                <div className="mt-4 pt-3 border-t border-slate-200/50 flex flex-col gap-2.5">
                                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                                        <span>Target: <strong className="text-slate-700">{targetMins} mins</strong></span>
                                        <span className="px-2 py-0.5 rounded-full bg-white/70 border border-slate-200 text-slate-700 font-semibold">
                                            P{item.priority !== null && item.priority !== undefined ? item.priority : '0'}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-xs bg-white/80 p-2 rounded-xl border border-slate-100">
                                        <span className="font-semibold text-slate-600">Time Spent:</span>
                                        <div className="flex items-center gap-1">
                                            <input
                                                type="text"
                                                defaultValue={timeSpentFormatted}
                                                onBlur={(e) => {
                                                    const val = e.target.value;
                                                    const match = val.match(/^(\d{1,2}):(\d{2})$/);
                                                    if (match) {
                                                        const hours = parseInt(match[1], 10);
                                                        const minutes = parseInt(match[2], 10);
                                                        if (minutes < 60) {
                                                            const seconds = hours * 3600 + minutes * 60;
                                                            if (seconds !== item.timeSpent) {
                                                                dispatch(updateTask({ ...item, timeSpent: seconds }));
                                                            }
                                                        }
                                                    }
                                                }}
                                                className="w-16 px-1.5 py-0.5 text-center font-mono text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Edit Task Modal */}
            {editingTask && (
                <Modal isOpen={!!editingTask} setIsOpen={() => setEditingTask(null)} title="Edit Task">
                    <AddTaskModal
                        setIsOpen={() => setEditingTask(null)}
                        taskToEdit={editingTask}
                        onSave={handleUpdateTaskSave}
                    />
                </Modal>
            )}

            {/* Delete Alert Modal */}
            <AlertModal
                visible={alertModal.visible}
                title={alertModal.title}
                message={alertModal.message}
                buttons={alertModal.buttons}
            />
        </div>
    );
};

export default TaskList;