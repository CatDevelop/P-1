import s from "./Pages.module.css";
import FirstMenu from "../components/Menu/Menu";
import React, {useEffect, useState} from "react";
import NoteCard from "../components/NoteCard/NoteCard";
import {useDispatch} from "react-redux";
import {getNotes} from "../store/slices/notesSlice"
import {useNotes} from "../hooks/use-notes";
import {App, Breadcrumb, FloatButton, Spin, Tooltip} from "antd";
import {removeNote} from "../store/slices/noteSlice";
import {FileAddOutlined, FolderAddOutlined} from "@ant-design/icons";
import {getUsers} from "../store/slices/usersSlice";
import {useUsers} from "../hooks/use-users";
import {Link, useParams, useSearchParams} from "react-router-dom";
import EditNoteSeriesDrawer from "../components/Drawers/EditNoteSeriesDrawer";
import CreateNoteDrawer from "../components/Drawers/CreateNoteDrawer";
import CreateNoteSeriesDrawer from "../components/Drawers/CreateNoteSeriesDrawer";
import EditNoteDrawer from "../components/Drawers/EditNoteDrawer";
import showDeleteNoteModal from "../components/Modals/DeleteNoteModal"
import showDeleteNoteSeriesModal from "../components/Modals/DeleteNoteSeriesModal"
import showDeleteNoteFromSeriesModal from "../components/Modals/DeleteNoteFromSeriesModal"
import {removeSchemes} from "../store/slices/schemesSlice";
import {removeTasks} from "../store/slices/tasksSlice";
import {useAuth} from "../hooks/use-auth";

export const NotesPage = (props) => {
    const dispatch = useDispatch()
    const {message, modal} = App.useApp();
    const [searchParams, setSearchParams] = useSearchParams();
    const {seriesID} = useParams()
    const notes = useNotes()
    const users = useUsers()
    const user = useAuth()

    const [contextMenuID, setContextMenuID] = useState(null)

    const [openCreateNote, setOpenCreateNote] = useState(false);

    const [openEditNote, setOpenEditNote] = useState(false);
    const [editNote, setEditNote] = useState(null);

    const [openCreateNoteSeries, setOpenCreateNoteSeries] = useState(false);

    const [openEditNoteSeries, setOpenEditNoteSeries] = useState(false);
    const [editNoteSeries, setEditNoteSeries] = useState(null);


    useEffect(() => {
        searchParams.forEach(e => console.log("!", e))
        if (searchParams.has("createnote")) {
            searchParams.delete('createnote')
            showCreateNote()
        }

        if (searchParams.has("creategroup")) {
            searchParams.delete('creategroup')
            showCreateNoteSeries()
        }
    }, [searchParams])

    useEffect(() => {
        dispatch(getNotes(seriesID))
        dispatch(getUsers())
        dispatch(removeNote())
        dispatch(removeSchemes())
        dispatch(removeTasks())
    }, [seriesID])

    const showCreateNote = () => {
        setOpenCreateNote(true);
    };

    const showCreateNoteSeries = () => {
        setOpenCreateNoteSeries(true);
    };

    const showEditNote = (note) => {
        setEditNote(note)
        setOpenEditNote(true);
    };

    const showEditNoteSeries = (note) => {
        setEditNoteSeries(note)
        setOpenEditNoteSeries(true);
    };

    return (<div>
        <div className={s.mainContainer}>
            <FirstMenu selectedKeys={["Notes"]}/>
            {seriesID !== "0" ? <Breadcrumb
                separator=">"
                items={[{
                    title: <Link to="/notes/0">Статьи</Link>,
                }, {
                    title: notes.seriesName
                }]}
            /> : <Breadcrumb
                separator=">"
                items={[{
                    title: "Статьи"
                }]}
            />}


            {(notes.isLoading || users.isLoading) ? <Spin/> : <div className={s.notes}>
                {notes.notes.length > 0 ? notes.notes.map(note => {
                    if(note.isVisible === '0' && note.ownerID !== user.id)
                        return;
                    let date = new Date(note.date ?? "2023-06-25 07:09:37");
                    let dateArray = date.toDateString().split(" ")
                    return <NoteCard id={note.id}
                                     type={note.type}
                                     title={note.title}
                                     image={note.image}
                                     tags={JSON.parse(note.tags)}
                                     seriesID={note.seriesID}
                                     currentSeriesID={seriesID}
                                     ownerID={note.ownerID ?? null}
                                     isBlocked={note.isBlocked ?? null}
                                     isVisible={note.isVisible ?? null}
                                     date={note.type === "note" ? dateArray[1] + " " + dateArray[2] + ", " + dateArray[3] : null}
                                     user={note.ownerID ? users.users.find(user => user.id === note.ownerID) : null}
                                     contextMenuID={contextMenuID}
                                     setContextMenuID={setContextMenuID}
                                     setOpenEditNote={setOpenEditNote}
                                     showEditNote={showEditNote}
                                     showEditNoteSeries={showEditNoteSeries}
                                     note={note}
                                     showDeleteNoteModal={showDeleteNoteModal}
                                     showDeleteNoteSeriesModal={showDeleteNoteSeriesModal}
                                     showDeleteNoteFromSeriesModal={showDeleteNoteFromSeriesModal}
                    />
                }) : <p className={s.notesPageNoNotes}>Нет статей в серии</p>}

                <FloatButton.Group shape="square">
                    {seriesID === "0" ? <Tooltip placement="left" title={"Создать группу"} arrow={false}>
                        <FloatButton icon={<FolderAddOutlined/>} type="default" onClick={() => {
                            showCreateNoteSeries()
                        }}/>
                    </Tooltip> : <></>}


                    <Tooltip placement="left" title={"Создать статью"} arrow={false}>
                        <FloatButton icon={<FileAddOutlined/>} type="default" onClick={() => {
                            showCreateNote()
                        }}/>
                    </Tooltip>
                </FloatButton.Group>


                <CreateNoteDrawer seriesID={seriesID}
                                  openCreateNote={openCreateNote}
                                  setOpenCreateNote={setOpenCreateNote}
                />

                {openCreateNoteSeries ? <CreateNoteSeriesDrawer seriesID={seriesID}
                                                                notes={notes}
                                                                openCreateNoteSeries={openCreateNoteSeries}
                                                                setOpenCreateNoteSeries={setOpenCreateNoteSeries}
                /> : <></>}

                <EditNoteDrawer seriesID={seriesID}
                                openEditNote={openEditNote}
                                setOpenEditNote={setOpenEditNote}
                                editNote={editNote}
                                setEditNote={setEditNote}
                />

                <EditNoteSeriesDrawer seriesID={seriesID}
                                      openEditNoteSeries={openEditNoteSeries}
                                      setOpenEditNoteSeries={setOpenEditNoteSeries}
                                      editNoteSeries={editNoteSeries}
                                      setEditNoteSeries={setEditNoteSeries}
                />
            </div>}
        </div>
    </div>)
}
