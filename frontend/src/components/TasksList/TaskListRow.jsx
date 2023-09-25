import s from './TaskList.module.css';
import {Avatar, Col, Row, Space, Tooltip} from "antd";
import {Badge} from '@mantine/core';
import classNames from "classnames";
import {
    TaskCompletedStatusIcon,
    TaskInWorkStatusIcon,
    TaskPlannedStatusIcon,
    TaskWaitingStatusIcon
} from "../Icons/Icons";
import React from "react";
import {updateTask} from "../../store/slices/taskSlice";
import {useDispatch} from "react-redux";
import TaskCategoryBadge from "../TaskComponents/TaskCategoryBadge/TaskCategoryBadge";
import TaskPriorityBadge from "../TaskComponents/TaskPriorityBadge/TaskPriorityBadge";

export default function TaskListRow(props) {
    const dispatch = useDispatch()
    let statusIcon;

    const handleChangeStatus = (status) => {
        dispatch(updateTask({
            taskID: props.task.id,
            type: "Status",
            value: status
        }))
    }

    if (props.task.status === 0)
        statusIcon = <div style={{display: "flex", justifyContent: "center"}} onClick={(e) => {

            e.stopPropagation()
            e.preventDefault()
            handleChangeStatus(1)
        }}>
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
                    stroke="#9C9C9C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    else if (props.task.status === 1)
        statusIcon = <div style={{display: "flex", justifyContent: "center"}} onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            handleChangeStatus(3)
        }}>
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M12.2933 9.30662L9.62892 7.53039C9.07512 7.16119 8.33333 7.55818 8.33333 8.22376V11.7762C8.33333 12.4418 9.07512 12.8388 9.62892 12.4696L12.2933 10.6934C12.788 10.3635 12.788 9.63648 12.2933 9.30662Z"
                    stroke="#9C9C9C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path
                    d="M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
                    stroke="#9C9C9C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    else if (props.task.status === 2)
        statusIcon = <div style={{display: "flex", justifyContent: "center"}} onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            handleChangeStatus(1)
        }}>
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M6.66667 10H6.675M10 10H10.0083M13.3333 10H13.3417M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
                    stroke="#9C9C9C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    else if (props.task.status === 3)
        statusIcon = <div style={{display: "flex", justifyContent: "center"}} onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            handleChangeStatus(1)
        }}>
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M7.5 10L9.16667 11.6667L12.5 8.33333M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
                    stroke="#9C9C9C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>

    const priorities = [
        {label: 'Незначительный', color: ""},
        {label: 'Низкий', color: "green"},
        {label: 'Средний', color: "yellow"},
        {label: 'Критичный', color: "red"},
        {label: 'Блокер', color: "red", variant: "filled"}
    ]

    const taskStatusItems = [
        {
            key: 'taskStatusPlanned',
            label: (
                <div style={{display: "flex", gap: "2px", alignItems: 'center'}}>
                    <TaskPlannedStatusIcon/>
                    Запланировано
                </div>
            ),
        },
        {
            key: 'taskStatusInWork',
            label: (
                <div style={{display: "flex", gap: "2px", alignItems: 'center'}}>
                    <TaskInWorkStatusIcon/>
                    В работе
                </div>
            ),
        },
        {
            key: 'taskStatusWaiting',
            label: (
                <div style={{display: "flex", gap: "2px", alignItems: 'center'}}>
                    <TaskWaitingStatusIcon/>
                    Ожидание
                </div>
            ),
        },
        {
            key: 'taskStatusCompleted',
            label: (
                <div style={{display: "flex", gap: "2px", alignItems: 'center'}}>
                    <TaskCompletedStatusIcon/>
                    Выполнено
                </div>
            ),
        },
    ];
    return (
        <div className={s.taskListRowContainer} onClick={() => {
            props.setEditTask(props.task)
            props.setOpenTaskDrawer(true)
        }}>
            <Row gutter={15} align="middle" wrap={false}>
                <Col flex={"auto"}>
                    <Row gutter={5} align="middle" wrap={false}>
                        <Col>

                                {/*<TaskCompletedStatusIcon/>*/}
                                {statusIcon}
                        </Col>
                        <Col>
                            <TaskPriorityBadge id={props.task.priority}/>

                        </Col>
                        <Col flex={"auto"}>
                            <p className={classNames(s.taskListRowName, props.task.status === 3 ? s.completedTask : "", !props.task.name ? s.taskListRowNameUndefined : "")}>{!props.task.name ? "Без названия" : props.task.name}</p>
                        </Col>
                    </Row></Col>

                {/*<Col flex={"auto"}>*/}
                {/*    /!*<Row gutter={5} align="middle" wrap={false}>*!/*/}
                {/*    /!*    <Col>*!/*/}
                {/*            <Dropdown menu={{items: taskStatusItems}} placement="bottomLeft"*/}
                {/*                      onClick={() => console.log(1)}>*/}
                {/*                /!*<TaskCompletedStatusIcon/>*!/*/}
                {/*                {statusIcon}*/}
                {/*            </Dropdown>*/}
                {/*        /!*</Col>*!/*/}
                {/*        /!*<Col>*!/*/}
                {/*            <p className={classNames(s.taskListRowName, props.task.status === 3 ? s.completedTask : "")}>{props.task.name}</p>*/}
                {/*        /!*</Col>*!/*/}
                {/*    /!*</Row>*!/*/}
                {/*</Col>*/}

                <Col>
                    {
                        props.task.responsible.length > 1 ?
                            <Avatar.Group style={{display: "flex", alignItems: "center"}}>
                                {
                                    props.task.responsible.map(userID => {
                                        let responsible = props.users.users.find(user => user.id === userID)
                                        return <Tooltip title={responsible.firstName + " " + responsible.secondName}>
                                            <Avatar size={24}
                                                    src={"https://ren-design.ru/api/knowledge-base/1.0/files/avatars/" + responsible.avatar}/>
                                        </Tooltip>
                                    })
                                }
                            </Avatar.Group> : <Space>
                                {
                                    props.task.responsible.map(userID => {
                                        let responsible = props.users.users.find(user => user.id === userID)
                                        return <Space>
                                            <Avatar size={24}
                                                    src={"https://ren-design.ru/api/knowledge-base/1.0/files/avatars/" + responsible.avatar}/>
                                            <p className={s.taskListRowResponsibleName}>{responsible.firstName + " " + responsible.secondName}</p>
                                        </Space>
                                    })
                                }
                            </Space>
                    }
                </Col>
                {/*<Col>*/}
                {/*    <Badge color={priorities[props.task.priority].color}*/}
                {/*           variant={priorities[props.task.priority].variant || "light"}*/}
                {/*           size="sm">*/}
                {/*        {*/}
                {/*            priorities[props.task.priority].label*/}
                {/*        }*/}
                {/*    </Badge>*/}
                {/*    /!*<div className={s.taskListRowPriority} style={{backgroundColor: "#A2F086"}}>*!/*/}
                {/*    /!*    {*!/*/}
                {/*    /!*        priorities[props.task.priority].label*!/*/}
                {/*    /!*    }*!/*/}
                {/*    /!*</div>*!/*/}
                {/*</Col>*/}
                {
                    props.task.categoryID !== 0 ?
                        <Col>
                            <TaskCategoryBadge id={props.task.categoryID}/>
                        </Col> : <></>
                }

            </Row>
        </div>
    )
}
