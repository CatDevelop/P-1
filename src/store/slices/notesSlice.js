import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import API from "../../api/API";
import {setNote} from "./noteSlice";

export const getNotes = createAsyncThunk(
    'notes/get',
    async function (seriesID, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(API.GET_NOTES+"?seriesID="+seriesID, {
                method: 'get'
            });

            if (!response.ok) {
                // alert("Username or password is incorrect");
                throw new Error(
                    `${response.status}${
                        response.statusText ? ' ' + response.statusText : ''
                    }`
                );
            }

            response = await response.json();

            dispatch(setNotes(response.data));
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    notes: [],
    seriesName: "",
    isLoading: true,
};

const notesSlice = createSlice({
    name: 'notes',
    initialState: initialState,
    reducers: {
        setNotes(state, action) {
            state.notes = action.payload.notes ?? []
            state.seriesName = action.payload.seriesName ?? ""
            state.isLoading = false
        },
        removeNotes(state, action) {
            state.notes = []
            state.seriesName = ""
            state.isLoading = true
        }
    },
    extraReducers: {

    },
});

export const {setNotes, removeNotes} = notesSlice.actions;

export default notesSlice.reducer;
