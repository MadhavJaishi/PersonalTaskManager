import { configureStore } from '@reduxjs/toolkit'
import tasklistSliceReducer from "../../src/pages/Dashboard/redux/tasklist"
import userSliceReducer from "../redux/userSlice"
// /Users/ggipl/Desktop/Projects/PersonalTaskMgr/frontend/src/redux/userSlice.ts

export const store = configureStore({
    reducer: {
        tasklistSliceReducer,
        userSliceReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch