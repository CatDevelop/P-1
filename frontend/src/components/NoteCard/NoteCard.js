import React from 'react';
import s from './NoteCard.module.css'
import {App, Avatar, Card, Dropdown, Popover, Tag} from 'antd';
import {useNavigate} from "react-router-dom";
import {DeleteOutlined, EditOutlined, EyeOutlined, SwapOutlined, ToolOutlined} from "@ant-design/icons";
import {useAuth} from "../../hooks/use-auth";
import {useDispatch} from "react-redux";

function NoteCard(props) {
    const {message, modal} = App.useApp();
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useAuth()
    console.log(props)
    const items = [
        props.type === "note" ? {
            label: 'Перейти к статье',
            icon: <EyeOutlined/>,
            key: 'goToNote',
            onClick: () => navigate("/note/" + props.id)
        } : null,

        props.type === "group" ? {
            label: 'Редактировать группу',
            icon: <ToolOutlined/>,
            key: 'editNoteSeriesMeta',
            onClick: () => {
                props.setContextMenuID(null)
                props.showEditNoteSeries(props.note)
            }
        } : null,


        props.type === "note" && props.ownerID === user.id ? {
            label: 'Редактировать статью',
            icon: <EditOutlined/>,
            key: 'editNote',
            onClick: () => navigate("/note/edit/" + props.id)
        } : null,
        props.type === "note" && props.ownerID === user.id ? {
            label: 'Редактировать мета-информацию',
            icon: <ToolOutlined/>,
            key: 'editNoteMeta',
            onClick: () => {
                props.setContextMenuID(null)
                props.showEditNote(props.note)
            }
        } : null,


        props.type === "note" && props.seriesID !== "0" && props.ownerID === user.id ? {
            label: 'Перенести из серии',
            icon: <SwapOutlined/>,
            key: 'deleteNoteFromSeries',
            onClick: () => {
                props.setContextMenuID(null)
                props.showDeleteNoteFromSeriesModal(dispatch, message, modal, props.id, props.currentSeriesID, props.title)
            }
        } : null,


        props.type === "note" && props.ownerID === user.id ? {
            label: 'Удалить статью',
            icon: <DeleteOutlined/>,
            key: 'deleteNote',
            onClick: () => {
                props.setContextMenuID(null)
                props.showDeleteNoteModal(dispatch, message, modal, props.id, props.currentSeriesID, props.title)
            }
        } : null,
        props.type === "group" ? {
            label: 'Удалить серию',
            icon: <DeleteOutlined/>,
            key: 'deleteNoteSeries',
            onClick: () => {
                props.setContextMenuID(null)
                props.showDeleteNoteSeriesModal(dispatch, message, modal, props.id, props.currentSeriesID, props.title)
            }
        } : null
    ];

    return (
        <Dropdown menu={{items}} trigger={['contextMenu']} id={props.id}
                  open={props.contextMenuID === (props.type === "group" ? "g" + props.id : props.id)}
                  onOpenChange={() => props.setContextMenuID(props.contextMenuID === (props.type === "group" ? "g" + props.id : props.id) ? null : (props.type === "group" ? "g" + props.id : props.id))}>
            <Card style={{width: 300, height: 400}}
                  bodyStyle={{padding: "12px"}}
                  cover={
                      <div style={{
                          margin: '0',
                          borderRadius: "8px 8px 0 0",
                          width: "300px",
                          height: "180px",
                          background: "url(" + props.image + ") no-repeat center center",
                          backgroundSize: 'cover',
                      }}
                      />
                  }
                  className={s.noteCard}
                  hoverable={true}
                  onClick={() => {
                      if (props.type === "group")
                          navigate("/notes/" + props.id)
                      else
                          navigate("/note/" + props.id)
                  }}
                  bordered={false}
            >
                <div className={s.blogMeta}>
                    <div>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <p className={s.blogData}>{props.type === "note" ? props.date : "Серия статей"}</p>

                            {
                                props.isVisible === '0' ?
                                    <Popover content={props.type === "note" ? "Статья видна только вам" : "Серия статей видна только вам"}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M3 3L6.58916 6.58916M21 21L17.4112 17.4112M13.8749 18.8246C13.2677 18.9398 12.6411 19 12.0005 19C7.52281 19 3.73251 16.0571 2.45825 12C2.80515 10.8955 3.33851 9.87361 4.02143 8.97118M9.87868 9.87868C10.4216 9.33579 11.1716 9 12 9C13.6569 9 15 10.3431 15 12C15 12.8284 14.6642 13.5784 14.1213 14.1213M9.87868 9.87868L14.1213 14.1213M9.87868 9.87868L6.58916 6.58916M14.1213 14.1213L6.58916 6.58916M14.1213 14.1213L17.4112 17.4112M6.58916 6.58916C8.14898 5.58354 10.0066 5 12.0004 5C16.4781 5 20.2684 7.94291 21.5426 12C20.8357 14.2507 19.3545 16.1585 17.4112 17.4112"
                                                stroke="#9C9C9C" strokeWidth="2" strokeLinecap="round"
                                                strokeLinejoin="round"/>
                                        </svg>
                                    </Popover>
                                    : <></>
                            }
                        </div>
                        <div className={props.type === "note" ? s.divider : s.groupDivider}></div>
                        <h2 className={s.blogTitle}>{props.title}</h2>
                    </div>
                    <div className={s.noteBottom}>
                        {
                            props.type === "note" ?
                                <div className={s.schemeUser}>
                                    <Avatar
                                        src={"https://ren-design.ru/api/knowledge-base/1.0/files/avatars/" + props.user.avatar}
                                        size={24}/>
                                    <div
                                        className={s.schemeUserName}>{props.user.secondName + " " + props.user.firstName}</div>
                                </div> : <></>
                        }
                        {
                            props.tags.length !== 0 ? <div className={s.tags}>
                                {
                                    props.tags.map(tag => {
                                        return <Tag>{tag}</Tag>
                                    })
                                }
                            </div> : <></>
                        }
                    </div>
                </div>
            </Card>
        </Dropdown>
    )
}

export default NoteCard;
