import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import API from '../../api/API';
import 'react-toastify/dist/ReactToastify.css';
import { App } from 'antd';

export const signInUser = createAsyncThunk(
    'user/signIn',
    async function (user, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(API.SIGN_IN, {
                method: 'post',
                body: JSON.stringify(user)
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

            dispatch(setUser(response.data));
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    id: null,
    login: null,
    firstName: null,
    secondName: null,
    avatar: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setUser(state, action) {
            state.id = action.payload.id;
            state.login = action.payload.login;
            state.firstName = action.payload.firstName;
            state.secondName = action.payload.secondName;
            state.avatar = action.payload.avatar;


            localStorage.setItem('P1-userId', action.payload.id);
            localStorage.setItem('P1-login', action.payload.login);
            localStorage.setItem('P1-firstName', action.payload.firstName);
            localStorage.setItem('P1-secondName', action.payload.secondName);
            localStorage.setItem('P1-avatar', action.payload.avatar);
        },
        removeUser(state) {
            state.id = null;
            state.login = null;
            state.firstName = null;
            state.secondName = null;
            state.avatar = null;

            localStorage.removeItem('P1-userId');
            localStorage.removeItem('P1-login');
            localStorage.removeItem('P1-firstName');
            localStorage.removeItem('P1-secondName');
            localStorage.removeItem('P1-avatar');
        },
    },
    extraReducers: {
    },
});

export const {setUser, removeUser} = userSlice.actions;

export default userSlice.reducer;
