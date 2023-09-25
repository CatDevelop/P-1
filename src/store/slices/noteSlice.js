import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import API from "../../api/API";
import {getNotes} from './notesSlice'

export const getNote = createAsyncThunk(
    'note/get',
    async function (id, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(API.GET_NETWORK_NOTE+"?id="+id, {
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

            dispatch(setNote(response.data));
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createNote = createAsyncThunk(
    'note/create',
    async function (payload, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(API.CREATE_NOTE, {
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

            dispatch(getNotes(payload.seriesID));
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createNoteSeries = createAsyncThunk(
    'note/series/create',
    async function (payload, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(API.CREATE_NOTE_SERIES, {
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

            dispatch(getNotes(payload.seriesID));
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateNote = createAsyncThunk(
    'note/update',
    async function (payload, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(API.UPDATE_NOTE, {
                method: 'post',
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                // alert("Username or password is incorrect");
                response = await response.json();
                throw new Error(
                    `${response.error}`
                );
            }

            response = await response.json();

            dispatch(getNote(payload.noteID));
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateNoteMeta = createAsyncThunk(
    'note/update/meta',
    async function (payload, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(API.UPDATE_NOTE_META, {
                method: 'post',
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                // alert("Username or password is incorrect");
                response = await response.json();
                throw new Error(
                    `${response.error}`
                );
            }

            response = await response.json();

            dispatch(getNotes(payload.seriesID));
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateNoteOwner = createAsyncThunk(
    'note/update/owner',
    async function (payload, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(API.UPDATE_NOTE_OWNER, {
                method: 'post',
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                // alert("Username or password is incorrect");
                response = await response.json();
                throw new Error(
                    `${response.error}`
                );
            }

            response = await response.json();

            dispatch(getNotes(payload.seriesID));
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateNoteSeriesMeta = createAsyncThunk(
    'note/series/update/meta',
    async function (payload, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(API.UPDATE_NOTE_SERIES_META, {
                method: 'post',
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                // alert("Username or password is incorrect");
                response = await response.json();
                throw new Error(
                    `${response.error}`
                );
            }

            response = await response.json();

            dispatch(getNotes(payload.seriesID));
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteNote = createAsyncThunk(
    'note/delete',
    async function (payload, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(API.DELETE_NOTE+"?id="+payload.noteID, {
                method: 'get'
            });

            if (!response.ok) {
                // alert("Username or password is incorrect");
                response = await response.json();
                throw new Error(
                    `${response.error}`
                );
            }

            response = await response.json();

            dispatch(getNotes(payload.seriesID));
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteNoteSeries = createAsyncThunk(
    'note/series/delete',
    async function (payload, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(API.DELETE_NOTE_SERIES+"?noteSeriesID="+payload.noteSeriesID, {
                method: 'get'
            });

            if (!response.ok) {
                // alert("Username or password is incorrect");
                response = await response.json();
                throw new Error(
                    `${response.error}`
                );
            }

            response = await response.json();

            dispatch(getNotes(payload.seriesID));
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteNoteFromSeries = createAsyncThunk(
    'note/delete/fromseries',
    async function (payload, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(API.DELETE_NOTE_FROM_SERIES+"?noteID="+payload.noteID, {
                method: 'get'
            });

            if (!response.ok) {
                // alert("Username or password is incorrect");
                response = await response.json();
                throw new Error(
                    `${response.error}`
                );
            }

            response = await response.json();

            dispatch(getNotes(payload.seriesID));
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    note: null,
    isLoading: true,
};

const noteSlice = createSlice({
    name: 'note',
    initialState: initialState,
    reducers: {
        setNote(state, action) {
            state.note = action.payload
            state.isLoading = false
        },
        removeNote(state) {
            state.note = null
            state.isLoading = true
        }
    },
    extraReducers: {

    },
});

export const {setNote, removeNote} = noteSlice.actions;

export default noteSlice.reducer;
