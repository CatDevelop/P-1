import s from '../Pages.module.css'
import Note from "../../components/Note/Note";
import React, {useEffect} from "react";
import {Breadcrumb, FloatButton, Spin, Tooltip} from "antd";
import {useDispatch} from "react-redux";
import {Link, useNavigate, useParams} from "react-router-dom";
import FirstMenu from "../../components/Menu/Menu";
import {getNote, removeNote} from "../../store/slices/noteSlice"
import {useNote} from "../../hooks/use-note";
import {EditOutlined} from "@ant-design/icons";
import {removeNotes} from "../../store/slices/notesSlice";
import {useAuth} from "../../hooks/use-auth";

export const NetworkNotePage = (props) => {
    const {noteID} = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const note = useNote()
    const user = useAuth()

    useEffect(() => {
        dispatch(getNote(noteID))
        dispatch(removeNotes())
        // if(directories.selectFilePath.length !== 0)
        //     ipcRenderer.send('readBlog', {path: directories.selectFilePath});
    }, [noteID])
    // useEffect(() => {
    //     ipcRenderer.removeAllListeners('shortcutS')
    // }, [])


    return (
        <div className={s.welcomePage}>
            <div className={s.mainContainer}>
                <FirstMenu selectedKeys={["Notes"]}/>
                {
                    !note.isLoading ?
                        <div className={s.workContainer}>
                            <Breadcrumb
                                separator=">"
                                items={[
                                    {
                                        title: <Link to="/notes/0">Статьи</Link>,
                                    },
                                    note.note.seriesName !== "" ? {
                                        title: <Link to={"/notes/"+note.note.seriesID}>{note.note.seriesName}</Link>,
                                    }: {},
                                    {
                                        title: note.note.title
                                    }
                                ]}
                            />
                            <div className={s.notePageContainer}>
                                <div className={s.noteTitleContainer}>
                                    <h1 className={s.noteTitle}>{note.note.title}</h1>
                                </div>
                                {
                                    <Note portfolio={JSON.parse(note.note.blocks)}/>
                                }
                            </div>
                            {
                                user.id === note.note.ownerID ?
                                    <FloatButton.Group shape="square">
                                        <Tooltip placement="left" title={"Редактировать статью"} arrow={false}>
                                            <FloatButton icon={<EditOutlined/>} type="default" onClick={() => {
                                                navigate("/network/edit/" + noteID)
                                            }}/>
                                        </Tooltip>
                                    </FloatButton.Group> : <></>
                            }
                        </div> : <Spin/>
                }

            </div>
        </div>
    )
}
