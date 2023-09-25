import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import API from "../../api/API";
import {updateTask} from "./taskSlice";
import {getNotes} from "./notesSlice";
import {getTasks} from "./tasksSlice";


export const getTimeTrackingRecords = createAsyncThunk(
    'timeTracking/get',
    async function (taskID, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(API.GET_TIME_TRACKING_RECORDS+"?taskID="+taskID, {
                method: 'get'
            });

            if (!response.ok) {
                throw new Error(
                    `${response.status}${
                        response.statusText ? ' ' + response.statusText : ''
                    }`
                );
            }

            response = await response.json();

            dispatch(setTimeTrackingRecords(response.data));
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createTimeTrackingRecord = createAsyncThunk(
    'timeTracking/create',
    async function (payload, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(API.CREATE_TIME_TRACKING_RECORD, {
                method: 'post',
                body: JSON.stringify(payload)
            });

            console.log(response)

            if (!response.ok) {
                response = await response.json();
                throw new Error(
                    `${response.error}`
                );
            }

            response = await response.json();

            dispatch(getTimeTrackingRecords(payload.taskID));
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateTimeTrackingRecord = createAsyncThunk(
    'timeTracking/update',
    async function (payload, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(API.UPDATE_TIME_TRACKING_RECORD, {
                method: 'post',
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                response = await response.json();
                throw new Error(
                    `${response.error}`
                );
            }

            response = await response.json();

            dispatch(getTimeTrackingRecords(payload.taskID));
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteTimeTrackingRecord = createAsyncThunk(
    'timeTracking/delete',
    async function (payload, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(API.DELETE_TIME_TRACKING_RECORD+"?id="+payload.recordID, {
                method: 'get'
            });

            if (!response.ok) {
                response = await response.json();
                throw new Error(
                    `${response.error}`
                );
            }

            response = await response.json();

            dispatch(getTimeTrackingRecords(payload.taskID));
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


const initialState = {
    timeTrackingRecords: [],
    isLoading: true,
};

const timeTrackingSlice = createSlice({
    name: 'timeTracking',
    initialState: initialState,
    reducers: {
        setTimeTrackingRecords(state, action) {
            state.timeTrackingRecords = action.payload
            state.isLoading = false
        },
        removeTimeTrackingRecords(state) {
            state.timeTrackingRecords = []
            state.isLoading = true
        }
    },
    extraReducers: {
        [createTimeTrackingRecord.rejected]: (state, action) => {
            throw new Error(
                `Ошибка создания записи учёта времени`
            );
        },
        [updateTimeTrackingRecord.rejected]: (state, action) => {
            throw new Error(
                `Ошибка изменения записи учёта времени`
            );
        },
        [deleteTimeTrackingRecord.rejected]: (state, action) => {
            throw new Error(
                `Ошибка удаления записи учёта времени`
            );
        },
    },
});

export const {setTimeTrackingRecords, removeTimeTrackingRecords} = timeTrackingSlice.actions;

export default timeTrackingSlice.reducer;
