import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import API from "../../api/API";

export const getSchemes = createAsyncThunk(
    'schemes/get',
    async function (_, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(API.GET_SCHEMES, {
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

            dispatch(setSchemes(response.data));
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


const initialState = {
    schemes: [],
    isLoading: true
};

const schemesSlice = createSlice({
    name: 'schemes',
    initialState: initialState,
    reducers: {
        setSchemes(state, action) {
            state.schemes = action.payload
            state.isLoading = false
        },
        removeSchemes(state) {
            state.schemes = []
            state.isLoading = true
        }
    },
    extraReducers: {

    },
});

export const {setSchemes, removeSchemes} = schemesSlice.actions;

export default schemesSlice.reducer;
