import { configureStore } from '@reduxjs/toolkit';
import localReducer from './slices/localSlice';
import notes1Reducer from './slices/localnoteSlice';
import userReducer from './slices/userSlice';
import usersReducer from './slices/usersSlice';
import networkNotesReducer from './slices/networkNotesSlice';
import schemesReducer from './slices/schemesSlice';
import schemeReducer from './slices/schemeSlice';
import notesReducer from './slices/notesSlice';
import noteReducer from './slices/noteSlice';
import tasksReducer from './slices/tasksSlice';
import taskReducer from './slices/taskSlice';
import timeTrackingReducer from './slices/timeTrackingSlice';


export default configureStore({
  reducer: {
    user: userReducer,
    users: usersReducer,
    local: localReducer,
    localNotes: notes1Reducer,
    schemes: schemesReducer,
    notes: notesReducer,
    note: noteReducer,
    scheme: schemeReducer,
    tasks: tasksReducer,
    task: taskReducer,
    networkNotes: networkNotesReducer,
    timeTracking: timeTrackingReducer,
  },
});
