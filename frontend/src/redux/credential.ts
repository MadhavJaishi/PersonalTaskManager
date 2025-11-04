import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCredentials = createAsyncThunk('credentials/fetchCredentials', async (_, thunk) => {
    try {
        const response = await axios.get('/api/credentials');
        return response.data as Credential[];
    } catch {
        return thunk.rejectWithValue('Failed to fetch credentials');
    }
})

interface Credential {
    app: string;
    username: string;
    password: string;
}
interface CredentialState {
    loading: boolean;
    credentials: Credential[];
}

const initialState: CredentialState = {
    loading: false,
    credentials: [],
};

const credentialSlice = createSlice({
    name: 'credentials',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchCredentials.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCredentials.fulfilled, (state, action) => {
                state.loading = false;
                state.credentials = action.payload;
            })
            .addCase(fetchCredentials.rejected, (state, action) => {
                const error = action.payload as string || 'Failed to fetch credentials';
                console.error(error);
            })
    },
})