import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    id: string | null;
    username: string | null;
    email: string | null;
}

const initialState: UserState = {
    id: null,
    username: null,
    email: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (
            state,
            action: PayloadAction<{ id: string; username: string; email: string }>
        ) => {
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.email = action.payload.email;

            localStorage.setItem("user", JSON.stringify(state));
        },

        clearUser: (state) => {
            state.id = null;
            state.username = null;
            state.email = null;
            localStorage.removeItem("user");
        },

        loadStoredUser: (state) => {
            const saved = localStorage.getItem("user");
            if (saved) {
                const parsed = JSON.parse(saved);
                state.id = parsed.id;
                state.username = parsed.username;
                state.email = parsed.email;
            }
        },
    },
});

export const { setUser, clearUser, loadStoredUser } = userSlice.actions;
export default userSlice.reducer;
