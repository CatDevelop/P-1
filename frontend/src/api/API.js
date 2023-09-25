import {HOST} from './host';

const SIGN_IN = `${HOST}/Authorization.php`;
const GET_NETWORK_NOTES_TREE = `${HOST}/GetNotes.php`;
const GET_NETWORK_NOTE = `${HOST}/GetNote.php`;
const GET_SCHEMES = `${HOST}/GetSchemes.php`;
const GET_SCHEME = `${HOST}/GetScheme.php`;
const GET_TASKS = `${HOST}/GetTasks.php`;
const GET_TIME_TRACKING_RECORDS = `${HOST}/GetTimeTrackingRecords.php`;
const UPDATE_SCHEME = `${HOST}/UpdateScheme.php`;

const GET_NOTES = `${HOST}/GetNotes2.php`;
const GET_USERS = `${HOST}/GetUsers.php`;
const CREATE_NOTE = `${HOST}/CreateNote.php`;
const CREATE_TIME_TRACKING_RECORD = `${HOST}/CreateTimeTrackingRecord.php`;
const CREATE_TASK = `${HOST}/CreateTask.php`;
const CREATE_SCHEME = `${HOST}/CreateScheme.php`;
const UPDATE_NOTE = `${HOST}/UpdateNote.php`;
const UPDATE_NOTE_META = `${HOST}/UpdateNoteMeta.php`;
const UPDATE_NOTE_OWNER = `${HOST}/UpdateNoteOwner.php`;
const UPDATE_NOTE_SERIES_META = `${HOST}/UpdateNoteSeriesMeta.php`;
const DELETE_NOTE = `${HOST}/DeleteNote.php`;
const DELETE_TIME_TRACKING_RECORD = `${HOST}/DeleteTimeTrackingRecord.php`;
const DELETE_SCHEME = `${HOST}/DeleteScheme.php`;
const DELETE_NOTE_SERIES = `${HOST}/DeleteNoteSeries.php`;
const DELETE_NOTE_FROM_SERIES = `${HOST}/DeleteNoteFromSeries.php`;
const CREATE_NOTE_SERIES = `${HOST}/CreateNoteSeries.php`;
const UPDATE_TASK_STATUS = `${HOST}/UpdateTaskStatus.php`;
const UPDATE_TASK_NAME = `${HOST}/UpdateTaskName.php`;
const UPDATE_TASK = `${HOST}/UpdateTask.php`;
const UPDATE_TIME_TRACKING_RECORD = `${HOST}/UpdateTimeTrackingRecord.php`;



const API = {
    DELETE_NOTE_FROM_SERIES,
    DELETE_TIME_TRACKING_RECORD,
    UPDATE_TIME_TRACKING_RECORD,
    UPDATE_NOTE_OWNER,
    SIGN_IN,
    GET_NETWORK_NOTES_TREE,
    GET_NETWORK_NOTE,
    GET_SCHEMES,
    GET_SCHEME,
    UPDATE_SCHEME,
    GET_NOTES,
    GET_TIME_TRACKING_RECORDS,
    CREATE_TIME_TRACKING_RECORD,
    GET_USERS,
    CREATE_NOTE,
    CREATE_SCHEME,
    CREATE_NOTE_SERIES,
    UPDATE_NOTE,
    UPDATE_NOTE_META,
    DELETE_NOTE,
    UPDATE_NOTE_SERIES_META,
    DELETE_NOTE_SERIES,
    GET_TASKS,
    DELETE_SCHEME,
    CREATE_TASK,
    UPDATE_TASK_STATUS,
    UPDATE_TASK_NAME,
    UPDATE_TASK
};

export default API;
