import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import API from "../../api/API";
import {getTasks} from './tasksSlice'
import {signInUser} from "./userSlice";
import {getSchemes} from "./schemesSlice";

export const createTask = createAsyncThunk(
    'task/create',
    async function (payload, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(API.CREATE_TASK, {
                method: 'post',
                body: JSON.stringify(payload)
            });

            console.log(response)

            if (!response.ok) {
                // alert("Username or password is incorrect");
                response = await response.json();
                throw new Error(
                    `${response.error}`
                );
            }

            response = await response.json();

            dispatch(getTasks());
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateTask = createAsyncThunk(
    'task/update',
    async function (payload, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(API.UPDATE_TASK, {
                method: 'post',
                body: JSON.stringify(payload)
            });

            console.log(response)

            if (!response.ok) {
                // alert("Username or password is incorrect");
                response = await response.json();
                throw new Error(
                    `${response.error}`
                );
            }

            response = await response.json();

            dispatch(getTasks());
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteTask = createAsyncThunk(
    'task/delete',
    async function (id, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(API.DELETE_TASK+"?taskID="+id, {
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

            dispatch(getTasks());
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    task: null,
    isLoading: true,
};

const taskSlice = createSlice({
    name: 'task',
    initialState: initialState,
    reducers: {
        setTask(state, action) {
            state.task = action.payload
            state.isLoading = false
        },
        removeTask(state) {
            state.task = null
            state.isLoading = true
        }
    },
    extraReducers: {
        [updateTask.rejected]: (state, action) => {
            throw new Error(
                `Ошибка изменения задачи`
            );
        },
        [deleteTask.rejected]: (state, action) => {
            throw new Error(
                `Ошибка удаления задачи`
            );
        },
    },
});

export const {setTask, removeTask} = taskSlice.actions;

export default taskSlice.reducer;
