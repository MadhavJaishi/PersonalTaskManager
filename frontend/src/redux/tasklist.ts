import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const colorENUM = {
    "3": 'bg-gradient-to-b from-[#C6DEFC] to-[#DEBEEF]',
    "2": 'bg-gradient-to-t from-[#DED1C6] to-[#DEBEEF]',
    "1": 'bg-gradient-to-b from-[#FADFD2] to-[#C6DECF]',
    "0": 'bg-gradient-to-t from-[#F2F3F4] to-[#DED1C6]',
} as const;
export interface Task {
    id: number;
    title: string;
    description: string;
    targetDuration: number; // in seconds
    notes: string;
    priority: keyof typeof colorENUM;
};

export const fetchTaskList = createAsyncThunk<Task[]>(
    'tasklist/fetchTaskList',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get('/api/tasks');
            const tasks = response.data;
            return tasks as Task[];
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to fetch tasks');
        }
    }
)

export const addTaskAsync = createAsyncThunk<Task, Task>(
    'tasklist/addTask',
    async (taskData, thunkAPI) => {
        try {
            const response = await axios.post('/api/tasks/add', taskData); // Cleaned up

            if (response.status !== 200) throw new Error('Failed to add task');

            return response.data as Task;
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to add task');
        }
    }
)


export const updateTask = createAsyncThunk<Task, Task>(
    'tasklist/updateTask',
    async (task, thunkAPI) => {
        try {
            const response = await axios.put(`/api/tasks/${task.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task),
            });
            if (response.status !== 200) throw new Error('Failed to update task');
            const updatedTask = response.data;
            return updatedTask as Task;
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to update task');
        }
    }
);

export const deleteTaskAsync = createAsyncThunk<number, number>(
    'tasklist/deleteTask',
    async (taskId, thunkAPI) => {
        try {
            const response = await axios.delete(`/api/tasks/${taskId}`, {
                method: 'DELETE',
            });

            if (response.status !== 200) {
                throw new Error('Failed to delete task');
            }

            return taskId; // Return the id of the deleted task
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to delete task');
        }
    }
);


interface TaskListState {
    tasks: Task[];
    loading: boolean;
    error: string | null;
}

const initialState: TaskListState = {
    tasks: [],
    loading: false,
    error: null,
};

const tasklistSlice = createSlice({
    name: 'tasklist',
    initialState,
    reducers: {
        // You can keep synchronous reducers if needed, otherwise remove
    },
    extraReducers: (builder) => {
        builder
            // Fetch tasks
            .addCase(fetchTaskList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTaskList.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTaskList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to fetch tasks';
            })

            // Add task
            .addCase(addTaskAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addTaskAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks.push(action.payload);
            })
            .addCase(addTaskAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to add task';
            })

            // Update task
            .addCase(updateTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.tasks.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to update task';
            })

            // Delete task
            .addCase(deleteTaskAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTaskAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = state.tasks.filter(task => task.id !== action.payload);
            })
            .addCase(deleteTaskAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to delete task';
            });
    },
});

export default tasklistSlice.reducer;
