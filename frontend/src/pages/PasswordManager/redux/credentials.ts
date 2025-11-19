import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface Credential {
    id?: string;
    appname: string;
    username: string;
    password: string;
}
const initialState = {
    credentials: [] as Array<Credential>,
    isLoading: false,
    error: '',
}
const fetchCredentials = createAsyncThunk('fetchCredentials', async (userId: string, thunkAPI) => {
    try {
        const response = await axios.get(`/credentials/${userId}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue((error as any).response.data);
    }
})
const addCredential = createAsyncThunk("addCredential", async (credential: Credential, thunkAPI) => {
    try {
        const response = await axios.post('/credentials/addCredential', credential);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue((error as any).response.data);
    }
})
const updateCredential = createAsyncThunk("updateCredential", async (credential: Credential, thunkAPI) => {
    try {
        const response = await axios.post('/credentials/updateCredential', credential);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue((error as any).response.data);
    }
})
const deleteCredential = createAsyncThunk('deleteCredential', async (credentialId: string, thunkAPI) => {
    try {
        const response = await axios.delete(`/credentials/deleteCredential/${credentialId}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue((error as any).response.data);
    }
})

const credentialsSlice = createSlice({
    name: "Credentials",
    initialState: initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCredentials.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCredentials.fulfilled, (state, action) => {
                state.credentials = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchCredentials.rejected, (state, action) => {
                state.error = (action.payload as any)?.error || "Something went wrong";
                state.isLoading = false;
            })
            .addCase(addCredential.fulfilled, (state, action) => {
                const updated = action.payload;
                const index = state.credentials.findIndex((item) => item.id === updated.id);
                if (index !== -1) state.credentials[index] = updated;
            })
            .addCase(updateCredential.fulfilled, (state, action) => {
                const updated = action.payload;
                const index = state.credentials.findIndex((item) => item.id === updated.id);
                if (index !== -1) state.credentials[index] = updated;
            })
            .addCase(deleteCredential.fulfilled, (state, action) => {
                const deletedId = action.meta.arg;
                state.credentials = state.credentials.filter(c => c.id !== deletedId);
            })
    }
})

export {
    fetchCredentials,
    addCredential,
    updateCredential,
    deleteCredential
};
export default credentialsSlice.reducer;