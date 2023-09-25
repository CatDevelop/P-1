import {useParams} from "react-router-dom";
import SideBar from "../../components/Side/SideBar/SideBar";
import s from '../Pages.module.css'
import {useNotes} from "../../hooks/use-notes";
import NetworkEditorJS from "../../components/EditorJS/NetworkEditorJS";
import {Spin} from "antd";
import {useEffect} from "react";
import {getNetworkNote} from "../../store/slices/networkNotesSlice";
import {useDispatch} from "react-redux";
import {useNote} from "../../hooks/use-note";
import {getNote} from "../../store/slices/noteSlice";

export const EditNetworkNotePage = (props) => {
    // const {localNotes, networkNotes} = useNotes()
    const dispatch = useDispatch()
    const {noteID} = useParams()
    const note = useNote()

    useEffect(() => {
        dispatch(getNote(noteID))
        // if(directories.selectFilePath.length !== 0)
        //     ipcRenderer.send('readBlog', {path: directories.selectFilePath});
    }, [noteID])

    return (
        <div className={s.welcomePage}>
            <div className={s.mainContainer}>
                <SideBar checked={false}/>
                <p>NETWORK EDIT</p>
                {
                    !note.isLoading ? <NetworkEditorJS notes={JSON.parse(note.note.blocks)} room={noteID}/> : <Spin/>
                }
            </div>


        </div>
    )
}
