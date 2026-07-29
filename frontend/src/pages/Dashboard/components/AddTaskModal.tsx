import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTaskAsync, Task } from '../redux/tasklist';
import type { AppDispatch, RootState } from '../../../redux/store';

interface AddTaskModalProps {
    setIsOpen: (isOpen: boolean) => void;
    taskToEdit?: Task | null;
    onSave?: (task: Task) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ setIsOpen, taskToEdit, onSave }) => {
    const dispatch = useDispatch<AppDispatch>();
    const userId = useSelector((state: RootState) => state.userSliceReducer.id);

    const [title, setTitle] = useState(taskToEdit?.title || '');
    const [description, setDescription] = useState(taskToEdit?.description || '');
    const [notes, setNotes] = useState(taskToEdit?.notes || '');
    const [durationMins, setDurationMins] = useState<number>(
        taskToEdit ? Math.round(taskToEdit.targetDuration / 60) : 30
    );
    const [priority, setPriority] = useState<string>(
        taskToEdit?.priority !== undefined && taskToEdit?.priority !== null
            ? String(taskToEdit.priority)
            : '1'
    );
    const [category, setCategory] = useState(taskToEdit?.category || 'General');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            setErrorMsg('Task title is required.');
            return;
        }

        const taskData: Partial<Task> = {
            ...(taskToEdit ? { id: taskToEdit.id } : {}),
            user_id: userId || undefined,
            title: title.trim(),
            description: description.trim(),
            notes: notes.trim(),
            targetDuration: Math.max(0, durationMins * 60),
            priority: priority,
            category,
            timeSpent: taskToEdit?.timeSpent || 0,
            is_completed: taskToEdit?.is_completed || false,
        };

        try {
            if (taskToEdit && onSave) {
                onSave(taskData as Task);
            } else {
                await dispatch(addTaskAsync(taskData)).unwrap();
            }
            setIsOpen(false);
        } catch (err: any) {
            const msg = typeof err === 'string' ? err : err?.message || 'Failed to save task.';
            setErrorMsg(msg);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-1">
            <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-xl font-bold text-slate-800">
                    {taskToEdit ? 'Edit Task' : 'Create New Task'}
                </h2>
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-2xl text-slate-400 hover:text-slate-600 transition"
                >
                    &times;
                </button>
            </div>

            {errorMsg && (
                <div className="p-3 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg">
                    {errorMsg}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Task Title <span className="text-rose-500">*</span>
                </label>
                <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What needs to be done?"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add brief details or context..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800 resize-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Target Duration (mins)
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="1440"
                        value={durationMins}
                        onChange={(e) => setDurationMins(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Priority Level</label>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
                    >
                        <option value="3">P3 - High / Critical</option>
                        <option value="2">P2 - Medium / Important</option>
                        <option value="1">P1 - Low / Standard</option>
                        <option value="0">P0 - Background / Minimal</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
                >
                    <option value="General">General</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Health">Health & Fitness</option>
                    <option value="Learning">Learning & Study</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Additional Notes</label>
                <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Optional tips or reminders"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
                />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow transition"
                >
                    {taskToEdit ? 'Save Changes' : 'Create Task'}
                </button>
            </div>
        </form>
    );
};

export default AddTaskModal;
