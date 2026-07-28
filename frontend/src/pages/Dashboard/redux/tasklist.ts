import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { api } from '../../../api-config/api'

export const colorENUM = {
  '3': 'bg-gradient-to-br from-rose-500/10 via-pink-500/10 to-red-500/15 border-rose-200 hover:border-rose-300',
  '2': 'bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-500/15 border-amber-200 hover:border-amber-300',
  '1': 'bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-sky-500/15 border-blue-200 hover:border-blue-300',
  '0': 'bg-gradient-to-br from-slate-500/10 via-gray-500/10 to-zinc-500/15 border-slate-200 hover:border-slate-300',
} as const

export interface Task {
  id: number | string
  user_id?: string
  title: string
  description: string
  targetDuration: number // in seconds
  timeSpent: number // in seconds
  notes?: string
  priority: string | null
  is_completed?: boolean
  category?: string
  due_date?: string
  created_at?: string
}

export const fetchTaskList = createAsyncThunk<Task[], { userId?: string } | undefined>(
  'tasklist/fetchTaskList',
  async (payload, thunkAPI) => {
    try {
      const url = payload?.userId ? `/tasks/${payload.userId}` : '/tasks'
      const response = await api.get(url)
      return (Array.isArray(response.data) ? response.data : response.data.tasks || []) as Task[]
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.error || 'Failed to fetch tasks')
    }
  },
)

export const addTaskAsync = createAsyncThunk<Task, Partial<Task>>(
  'tasklist/addTask',
  async (taskData, thunkAPI) => {
    try {
      const response = await api.post('/tasks/addTask', taskData)
      return (response.data.task || response.data) as Task
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.error || 'Failed to add task')
    }
  },
)

export const updateTask = createAsyncThunk<Task, Task>(
  'tasklist/updateTask',
  async (task, thunkAPI) => {
    try {
      const response = await api.put(`/tasks/${task.id}`, task)
      return (response.data.task || response.data) as Task
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.error || 'Failed to update task')
    }
  },
)

export const toggleTaskAsync = createAsyncThunk<Task, number | string>(
  'tasklist/toggleTask',
  async (taskId, thunkAPI) => {
    try {
      const response = await api.patch(`/tasks/${taskId}/toggle`)
      return (response.data.task || response.data) as Task
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.error || 'Failed to toggle task completion')
    }
  },
)

export const deleteTaskAsync = createAsyncThunk<number | string, number | string>(
  'tasklist/deleteTask',
  async (taskId, thunkAPI) => {
    try {
      await api.delete(`/tasks/${taskId}`)
      return taskId
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.error || 'Failed to delete task')
    }
  },
)

interface TaskListState {
  tasks: Task[]
  loading: boolean
  error: string | null
}

const initialState: TaskListState = {
  tasks: [],
  loading: false,
  error: null,
}

const tasklistSlice = createSlice({
  name: 'tasklist',
  initialState,
  reducers: {
    clearTaskError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTaskList.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTaskList.fulfilled, (state, action) => {
        state.loading = false
        state.tasks = action.payload
      })
      .addCase(fetchTaskList.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Failed to fetch tasks'
      })

      // Add task
      .addCase(addTaskAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addTaskAsync.fulfilled, (state, action) => {
        state.loading = false
        state.tasks.unshift(action.payload)
      })
      .addCase(addTaskAsync.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Failed to add task'
      })

      // Update task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => String(t.id) === String(action.payload.id))
        if (index !== -1) {
          state.tasks[index] = action.payload
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Failed to update task'
      })

      // Toggle task completion
      .addCase(toggleTaskAsync.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => String(t.id) === String(action.payload.id))
        if (index !== -1) {
          state.tasks[index] = action.payload
        }
      })

      // Delete task
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.loading = false
        state.tasks = state.tasks.filter((task) => String(task.id) !== String(action.payload))
      })
      .addCase(deleteTaskAsync.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Failed to delete task'
      })
  },
})

export const { clearTaskError } = tasklistSlice.actions
export default tasklistSlice.reducer
