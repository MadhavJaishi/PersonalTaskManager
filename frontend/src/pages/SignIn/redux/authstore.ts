import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    username: "",
    email: "",
    password: ""
}
const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setAuth(state, action) {
            state = action.payload;
        },
        deleteAuth(state) {
            state = initialState;
        }
    }
})
export default authSlice.reducer;