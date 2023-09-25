import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import API from "../../api/API";

export const getUsers = createAsyncThunk(
    'users/get',
    async function (seriesID, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(API.GET_USERS, {
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

            dispatch(setUsers(response.data));
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    users: [],
    isLoading: true,
};

const usersSlice = createSlice({
    name: 'users',
    initialState: initialState,
    reducers: {
        setUsers(state, action) {
            state.users = action.payload
            state.isLoading = false
        },
        removeUsers(state, action) {
            state.users = action.payload
            state.isLoadingNote = false
        }
    },
    extraReducers: {

    },
});

export const {setUsers, removeUsers} = usersSlice.actions;

export default usersSlice.reducer;
