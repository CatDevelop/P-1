import React from 'react';
import {Draggable} from "react-beautiful-dnd";
import s from './TasksBoard.module.css'
import TaskCategoryBadge from "../TaskComponents/TaskCategoryBadge/TaskCategoryBadge";
import classNames from 'classnames'
import TaskPriorityBadge from "../TaskComponents/TaskPriorityBadge/TaskPriorityBadge";
import {Avatar, Tooltip} from "antd";
const TaskCard = (props) => {
    const priorityColors = [
        "#20c997", "#845ef7", "#fcc419", "#cc5de8", "#adb5bd"
    ]
    return (
        <Draggable draggableId={props.id} index={props.index}>
            {(provided) => (
                <div
                    className={classNames(s.taskCard)}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => {
                        props.setEditTask(props.task)
                        props.setOpenTaskDrawer(true)
                    }}
                    style={props.task.categoryID !== 0 ? {
                        borderLeft: `5px solid ${priorityColors[props.task.categoryID-1]}`
                    } : undefined}
                >
                    <div className={s.rowContainer}>
                        <div>
                            {
                                props.task.categoryID !== 0 ?
                                    <TaskCategoryBadge id={props.task.categoryID}/> : <></>
                            }
                        </div>


                        <TaskPriorityBadge id={props.task.priority}/>
                    </div>

                    {props.task.name}
                    <div className={s.rowContainer}>
                        <div>

                        </div>
                        <Avatar.Group style={{display: "flex", alignItems: "center"}}>
                            {
                                props.task.responsible.map(userID => {
                                    let responsible = props.users.users.find(user => user.id === userID)
                                    return <Tooltip title={responsible.firstName + " " + responsible.secondName} placement={"bottom"}>
                                        <Avatar size={24}
                                                src={"https://ren-design.ru/api/knowledge-base/1.0/files/avatars/" + responsible.avatar}/>
                                    </Tooltip>
                                })
                            }
                        </Avatar.Group>
                    </div>
                </div>
            )}
        </Draggable>
    );
};
export default TaskCard;
