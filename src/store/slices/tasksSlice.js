import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import API from "../../api/API";

export const getTasks = createAsyncThunk(
    'tasks/get',
    async function (seriesID, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(API.GET_TASKS, {
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

            dispatch(setTasks(response.data));
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    tasks: [],
    isLoading: true,
};

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        setTasks(state, action) {
            state.tasks = action.payload.tasks || []
            state.isLoading = false
        },
        removeTasks(state, action) {
            state.tasks = []
            state.isLoading = true
        }
    },
    extraReducers: {

    },
});

export const {setTasks, removeTasks} = tasksSlice.actions;

export default tasksSlice.reducer;
