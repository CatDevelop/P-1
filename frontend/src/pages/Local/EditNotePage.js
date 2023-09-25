import s from '../Pages.module.css'
import EditorJS from "../../components/EditorJS/EditorJS";
import {useNote} from "../../hooks/use-note";
import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import {getNote} from "../../store/slices/noteSlice";
import FirstMenu from "../../components/Menu/Menu";


export const EditNotePage = (props) => {
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
                <FirstMenu selectedKeys={["Notes"]}/>
                {/*{*/}
                {/*    notes.notes ? <MermaidRender portfolio={JSON.parse(notes.notes)}/> : ""*/}
                {/*}*/}
                {
                    !note.isLoading ? <EditorJS noteID={noteID} notes={JSON.parse(note.note.blocks)}/> : ""
                }


                {/*<EditorJS notes={JSON.parse(notes.notes)}/>*/}

                {/*<NavLink to="/test">123123</NavLink>*/}
                {/*123123*/}
                {/*<Button>123123</Button>*/}
            </div>


        </div>
    )
}
