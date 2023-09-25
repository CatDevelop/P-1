import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import API from "../../api/API";
import {getSchemes} from "./schemesSlice";


export const createScheme = createAsyncThunk(
    'scheme/create',
    async function (props, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(API.CREATE_SCHEME, {
                method: 'post',
                body: JSON.stringify(props)
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

            dispatch(getSchemes());
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getScheme = createAsyncThunk(
    'scheme/get',
    async function (id, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(API.GET_SCHEME+"?ID="+id, {
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

            dispatch(setScheme(response.data));
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateScheme = createAsyncThunk(
    'scheme/update',
    async function (props, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(API.UPDATE_SCHEME, {
                method: 'post',
                body: JSON.stringify(props)
            });

            if (!response.ok) {
                // alert("Username or password is incorrect");
                throw new Error(
                    `${response.status}${
                        response.statusText ? ' ' + response.statusText : ''
                    }`
                );
            }

            // response = await response.json();

            // dispatch(setScheme((props)));
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteScheme = createAsyncThunk(
    'scheme/delete',
    async function (id, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(API.DELETE_SCHEME+"?schemeID="+id, {
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

            dispatch(getSchemes());
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


const initialState = {
    scheme: [],
    isLoading: true
};

const schemeSlice = createSlice({
    name: 'scheme',
    initialState: initialState,
    reducers: {
        setScheme(state, action) {
            state.scheme = action.payload
            state.isLoading = false
        },
        removeScheme(state) {
            state.scheme = []
            state.isLoading = true
        }
    },
    extraReducers: {

    },
});

export const {setScheme, removeScheme} = schemeSlice.actions;

export default schemeSlice.reducer;
