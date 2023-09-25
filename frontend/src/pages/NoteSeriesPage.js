import s from "./Pages.module.css";
import FirstMenu from "../components/Menu/Menu";
import React, {useEffect} from "react";
import NoteCard from "../components/NoteCard/NoteCard";
import {useDispatch} from "react-redux";
import {getNotes} from "../store/slices/notesSlice"
import {useNotes} from "../hooks/use-notes";
import {Breadcrumb, FloatButton, Spin, Tooltip} from "antd";
import {Link, useParams} from "react-router-dom";
import {removeNote} from "../store/slices/noteSlice";
import {FileAddOutlined} from "@ant-design/icons";
import {useUsers} from "../hooks/use-users";
import {getUsers} from "../store/slices/usersSlice";

export const NoteSeriesPage = () => {
    const {seriesID} = useParams()
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getNotes(seriesID))
        dispatch(getUsers())
        dispatch(removeNote())
    }, [])
    const notes = useNotes()
    const users = useUsers()

    return (
        <div>
            <div className={s.mainContainer}>
                <FirstMenu selectedKeys={["Notes"]}/>
                {
                    notes.isLoading ? <Spin/> : <>
                        <Breadcrumb
                            separator=">"
                            items={[
                                {
                                    title: <Link to="/notes/">Статьи</Link>,
                                },
                                {
                                    title: notes.seriesName
                                }
                            ]}
                        />
                        {/*<div className={s.pageTitle}>Статьи 1</div>*/}
                        {
                            notes.isLoading ? <Spin/> :
                                <div className={s.notes}>
                                    {
                                        notes.notes.map(note => {
                                            let date = new Date(note.date ?? "2023-06-25 07:09:37");
                                            let dateArray = date.toDateString().split(" ")
                                            return <NoteCard id={note.id}
                                                             type={note.type}
                                                             title={note.title}
                                                             image={note.image}
                                                             tags={JSON.parse(note.tags)}
                                                             ownerID={note.ownerID ?? null}
                                                             isBlocked={note.isBlocked ?? null}
                                                             date={note.type === "note" ? dateArray[1] + " " + dateArray[2] + ", " + dateArray[3] : null}
                                                             user={note.ownerID ? users.users.find(user => user.id === note.ownerID) : null}
                                            />
                                        })
                                    }

                                    <Tooltip placement="left" title={"Создать статью"} arrow={false}>
                                        <FloatButton icon={<FileAddOutlined />} type="default" onClick={() => {
                                            console.log("Create Note")
                                        }}/>
                                    </Tooltip>
                                </div>
                        }
                    </>
                }


            </div>
        </div>
    )
}
