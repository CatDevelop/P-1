import {App, Button, Cascader, Col, Drawer, Dropdown, Input, Row, Space, Spin, Typography} from "antd";
import s from "./TaskDrawer.module.css"
import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {useAuth} from "../../hooks/use-auth";
import {Badge} from "@mantine/core";
import {useUsers} from "../../hooks/use-users";
import {
    TaskCompletedStatusIcon,
    TaskInWorkStatusIcon,
    TaskPlannedStatusIcon,
    TaskWaitingStatusIcon
} from "../Icons/Icons";
import {updateTask} from "../../store/slices/taskSlice";
import classNames from 'classnames'
import TimeTrackingRow from "../TimeTrackingRow/TimeTrackingRow";
import {useTimeTracking} from "../../hooks/use-time-tracking";
import {createTimeTrackingRecord, getTimeTrackingRecords} from "../../store/slices/timeTrackingSlice";
import TaskCategoryBadge from "../TaskComponents/TaskCategoryBadge/TaskCategoryBadge";
import dayjs from "dayjs";
import showDeleteTaskModal from "../Modals/DeleteTaskModal";


export default function TaskDrawer(props) {
    const {message, modal} = App.useApp();
    const dispatch = useDispatch()
    const user = useAuth()
    const users = useUsers()
    const timeTracking = useTimeTracking()

    const time = [
        {
            value: 0, label: "0h", children: [
                {value: 0, label: "0m"},
                {value: 5, label: "5m"},
                {value: 10, label: "10m"},
                {value: 15, label: "15m"},
                {value: 20, label: "20m"},
                {value: 25, label: "25m"},
                {value: 30, label: "30m"},
                {value: 35, label: "35m"},
                {value: 40, label: "40m"},
                {value: 45, label: "45m"},
                {value: 50, label: "50m"},
                {value: 55, label: "55m"},
            ]
        },
        {
            value: 1, label: "1h", children: [
                {value: 0, label: "0m"},
                {value: 5, label: "5m"},
                {value: 10, label: "10m"},
                {value: 15, label: "15m"},
                {value: 20, label: "20m"},
                {value: 25, label: "25m"},
                {value: 30, label: "30m"},
                {value: 35, label: "35m"},
                {value: 40, label: "40m"},
                {value: 45, label: "45m"},
                {value: 50, label: "50m"},
                {value: 55, label: "55m"},
            ]
        },
        {
            value: 2, label: "2h", children: [
                {value: 0, label: "0m"},
                {value: 5, label: "5m"},
                {value: 10, label: "10m"},
                {value: 15, label: "15m"},
                {value: 20, label: "20m"},
                {value: 25, label: "25m"},
                {value: 30, label: "30m"},
                {value: 35, label: "35m"},
                {value: 40, label: "40m"},
                {value: 45, label: "45m"},
                {value: 50, label: "50m"},
                {value: 55, label: "55m"},
            ]
        },
        {
            value: 3, label: "3h", children: [
                {value: 0, label: "0m"},
                {value: 5, label: "5m"},
                {value: 10, label: "10m"},
                {value: 15, label: "15m"},
                {value: 20, label: "20m"},
                {value: 25, label: "25m"},
                {value: 30, label: "30m"},
                {value: 35, label: "35m"},
                {value: 40, label: "40m"},
                {value: 45, label: "45m"},
                {value: 50, label: "50m"},
                {value: 55, label: "55m"},
            ]
        },
        {
            value: 4, label: "4h", children: [
                {value: 0, label: "0m"},
                {value: 5, label: "5m"},
                {value: 10, label: "10m"},
                {value: 15, label: "15m"},
                {value: 20, label: "20m"},
                {value: 25, label: "25m"},
                {value: 30, label: "30m"},
                {value: 35, label: "35m"},
                {value: 40, label: "40m"},
                {value: 45, label: "45m"},
                {value: 50, label: "50m"},
                {value: 55, label: "55m"},
            ]
        },
        {
            value: 5, label: "5h", children: [
                {value: 0, label: "0m"},
                {value: 5, label: "5m"},
                {value: 10, label: "10m"},
                {value: 15, label: "15m"},
                {value: 20, label: "20m"},
                {value: 25, label: "25m"},
                {value: 30, label: "30m"},
                {value: 35, label: "35m"},
                {value: 40, label: "40m"},
                {value: 45, label: "45m"},
                {value: 50, label: "50m"},
                {value: 55, label: "55m"},
            ]
        },
        {
            value: 6, label: "6h", children: [
                {value: 0, label: "0m"},
                {value: 5, label: "5m"},
                {value: 10, label: "10m"},
                {value: 15, label: "15m"},
                {value: 20, label: "20m"},
                {value: 25, label: "25m"},
                {value: 30, label: "30m"},
                {value: 35, label: "35m"},
                {value: 40, label: "40m"},
                {value: 45, label: "45m"},
                {value: 50, label: "50m"},
                {value: 55, label: "55m"},
            ]
        },
        {
            value: 7, label: "7h", children: [
                {value: 0, label: "0m"},
                {value: 5, label: "5m"},
                {value: 10, label: "10m"},
                {value: 15, label: "15m"},
                {value: 20, label: "20m"},
                {value: 25, label: "25m"},
                {value: 30, label: "30m"},
                {value: 35, label: "35m"},
                {value: 40, label: "40m"},
                {value: 45, label: "45m"},
                {value: 50, label: "50m"},
                {value: 55, label: "55m"},
            ]
        },
        {
            value: 8, label: "8h", children: [
                {value: 0, label: "0m"},
                {value: 5, label: "5m"},
                {value: 10, label: "10m"},
                {value: 15, label: "15m"},
                {value: 20, label: "20m"},
                {value: 25, label: "25m"},
                {value: 30, label: "30m"},
                {value: 35, label: "35m"},
                {value: 40, label: "40m"},
                {value: 45, label: "45m"},
                {value: 50, label: "50m"},
                {value: 55, label: "55m"},
            ]
        },
        {
            value: 9, label: "9h", children: [
                {value: 0, label: "0m"},
                {value: 5, label: "5m"},
                {value: 10, label: "10m"},
                {value: 15, label: "15m"},
                {value: 20, label: "20m"},
                {value: 25, label: "25m"},
                {value: 30, label: "30m"},
                {value: 35, label: "35m"},
                {value: 40, label: "40m"},
                {value: 45, label: "45m"},
                {value: 50, label: "50m"},
                {value: 55, label: "55m"},
            ]
        },
        {
            value: 10, label: "10h", children: [
                {value: 0, label: "0m"},
                {value: 5, label: "5m"},
                {value: 10, label: "10m"},
                {value: 15, label: "15m"},
                {value: 20, label: "20m"},
                {value: 25, label: "25m"},
                {value: 30, label: "30m"},
                {value: 35, label: "35m"},
                {value: 40, label: "40m"},
                {value: 45, label: "45m"},
                {value: 50, label: "50m"},
                {value: 55, label: "55m"},
            ]
        },
        {
            value: 11, label: "11h", children: [
                {value: 0, label: "0m"},
                {value: 5, label: "5m"},
                {value: 10, label: "10m"},
                {value: 15, label: "15m"},
                {value: 20, label: "20m"},
                {value: 25, label: "25m"},
                {value: 30, label: "30m"},
                {value: 35, label: "35m"},
                {value: 40, label: "40m"},
                {value: 45, label: "45m"},
                {value: 50, label: "50m"},
                {value: 55, label: "55m"},
            ]
        },
        {
            value: 12, label: "12h", children: [
                {value: 0, label: "0m"},
                {value: 5, label: "5m"},
                {value: 10, label: "10m"},
                {value: 15, label: "15m"},
                {value: 20, label: "20m"},
                {value: 25, label: "25m"},
                {value: 30, label: "30m"},
                {value: 35, label: "35m"},
                {value: 40, label: "40m"},
                {value: 45, label: "45m"},
                {value: 50, label: "50m"},
                {value: 55, label: "55m"},
            ]
        },
        {
            value: 13, label: "13h", children: [
                {value: 0, label: "0m"},
                {value: 5, label: "5m"},
                {value: 10, label: "10m"},
                {value: 15, label: "15m"},
                {value: 20, label: "20m"},
                {value: 25, label: "25m"},
                {value: 30, label: "30m"},
                {value: 35, label: "35m"},
                {value: 40, label: "40m"},
                {value: 45, label: "45m"},
                {value: 50, label: "50m"},
                {value: 55, label: "55m"},
            ]
        },
        {
            value: 14, label: "14h", children: [
                {value: 0, label: "0m"},
                {value: 5, label: "5m"},
                {value: 10, label: "10m"},
                {value: 15, label: "15m"},
                {value: 20, label: "20m"},
                {value: 25, label: "25m"},
                {value: 30, label: "30m"},
                {value: 35, label: "35m"},
                {value: 40, label: "40m"},
                {value: 45, label: "45m"},
                {value: 50, label: "50m"},
                {value: 55, label: "55m"},
            ]
        },
        {
            value: 15, label: "15h", children: [
                {value: 0, label: "0m"},
                {value: 5, label: "5m"},
                {value: 10, label: "10m"},
                {value: 15, label: "15m"},
                {value: 20, label: "20m"},
                {value: 25, label: "25m"},
                {value: 30, label: "30m"},
                {value: 35, label: "35m"},
                {value: 40, label: "40m"},
                {value: 45, label: "45m"},
                {value: 50, label: "50m"},
                {value: 55, label: "55m"},
            ]
        },
        {
            value: 16, label: "16h", children: [
                {value: 0, label: "0m"},
                {value: 5, label: "5m"},
                {value: 10, label: "10m"},
                {value: 15, label: "15m"},
                {value: 20, label: "20m"},
                {value: 25, label: "25m"},
                {value: 30, label: "30m"},
                {value: 35, label: "35m"},
                {value: 40, label: "40m"},
                {value: 45, label: "45m"},
                {value: 50, label: "50m"},
                {value: 55, label: "55m"},
            ]
        },
        {
            value: 17, label: "17h", children: [
                {value: 0, label: "0m"},
                {value: 5, label: "5m"},
                {value: 10, label: "10m"},
                {value: 15, label: "15m"},
                {value: 20, label: "20m"},
                {value: 25, label: "25m"},
                {value: 30, label: "30m"},
                {value: 35, label: "35m"},
                {value: 40, label: "40m"},
                {value: 45, label: "45m"},
                {value: 50, label: "50m"},
                {value: 55, label: "55m"},
            ]
        },
        {
            value: 18, label: "18h", children: [
                {value: 0, label: "0m"},
                {value: 5, label: "5m"},
                {value: 10, label: "10m"},
                {value: 15, label: "15m"},
                {value: 20, label: "20m"},
                {value: 25, label: "25m"},
                {value: 30, label: "30m"},
                {value: 35, label: "35m"},
                {value: 40, label: "40m"},
                {value: 45, label: "45m"},
                {value: 50, label: "50m"},
                {value: 55, label: "55m"},
            ]
        },
        {
            value: 19, label: "19h", children: [
                {value: 0, label: "0m"},
                {value: 5, label: "5m"},
                {value: 10, label: "10m"},
                {value: 15, label: "15m"},
                {value: 20, label: "20m"},
                {value: 25, label: "25m"},
                {value: 30, label: "30m"},
                {value: 35, label: "35m"},
                {value: 40, label: "40m"},
                {value: 45, label: "45m"},
                {value: 50, label: "50m"},
                {value: 55, label: "55m"},
            ]
        },
        {
            value: 20, label: "20h", children: [
                {value: 0, label: "0m"},
                {value: 5, label: "5m"},
                {value: 10, label: "10m"},
                {value: 15, label: "15m"},
                {value: 20, label: "20m"},
                {value: 25, label: "25m"},
                {value: 30, label: "30m"},
                {value: 35, label: "35m"},
                {value: 40, label: "40m"},
                {value: 45, label: "45m"},
                {value: 50, label: "50m"},
                {value: 55, label: "55m"},
            ]
        },
        {
            value: 21, label: "21h", children: [
                {value: 0, label: "0m"},
                {value: 5, label: "5m"},
                {value: 10, label: "10m"},
                {value: 15, label: "15m"},
                {value: 20, label: "20m"},
                {value: 25, label: "25m"},
                {value: 30, label: "30m"},
                {value: 35, label: "35m"},
                {value: 40, label: "40m"},
                {value: 45, label: "45m"},
                {value: 50, label: "50m"},
                {value: 55, label: "55m"},
            ]
        },
        {
            value: 22, label: "22h", children: [
                {value: 0, label: "0m"},
                {value: 5, label: "5m"},
                {value: 10, label: "10m"},
                {value: 15, label: "15m"},
                {value: 20, label: "20m"},
                {value: 25, label: "25m"},
                {value: 30, label: "30m"},
                {value: 35, label: "35m"},
                {value: 40, label: "40m"},
                {value: 45, label: "45m"},
                {value: 50, label: "50m"},
                {value: 55, label: "55m"},
            ]
        },
    ]


    const handleChangeStatus = (status) => {
        let oldStatus = props.editTask.status
        props.setEditTask({...props.editTask, status})
        dispatch(updateTask({
            taskID: props.editTask.id,
            type: "Status",
            value: status
        })).then(() => {
        }, () => {
            props.setEditTask({...props.editTask, status: oldStatus})
            message.open({
                key: 'errorChangeStatus',
                type: 'error',
                content: "Ошибка изменения статуса",
                duration: 2,
            });
        })
    }

    const handleChangeName = (name) => {
        let oldName = props.editTask.name
        props.setEditTask({...props.editTask, name})
        dispatch(updateTask({
            taskID: props.editTask.id,
            type: 'Name',
            value: name
        })).then(() => {
        }, () => {
            props.setEditTask({...props.editTask, name: oldName})
            message.open({
                key: 'errorChangeName',
                type: 'error',
                content: "Ошибка изменения названия",
                duration: 2,
            });
        })
    }

    const handleChangeDescription = (description) => {
        let oldDescription = props.editTask.description
        props.setEditTask({...props.editTask, description})
        dispatch(updateTask({
            taskID: props.editTask.id,
            type: 'Description',
            value: description
        })).then(() => {
        }, () => {
            props.setEditTask({...props.editTask, description: oldDescription})
            message.open({
                key: 'errorChangeDescription',
                type: 'error',
                content: "Ошибка изменения описания",
                duration: 2,
            });
        })
    }

    const handleCreateTimeTrackingRecord = (time) => {
        message.open({
            key: 'createTimeTrackingRecord',
            type: 'loading',
            content: "Создаю запись...",
            duration: 2,
        });


        dispatch(createTimeTrackingRecord({
            taskID: props.editTask.id,
            createUserID: user.id,
            description: "",
            time: time[0] * 60 + time[1],
            date: dayjs()
        })).then(
            () => {
                message.open({
                    key: 'createTimeTrackingRecord',
                    type: 'success',
                    content: "Ваше время успешно учтено!",
                    duration: 2,
                });
            },
            () => {
                message.open({
                    key: 'createTimeTrackingRecord',
                    type: 'error',
                    content: "Ошибка сервера. Попробуйте позже",
                    duration: 2,
                });
            })
    }

    let statusIcon;
    if (props.editTask.status === 0)
        statusIcon = <div style={{display: "flex", justifyContent: "center"}}>
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    else if (props.editTask.status === 1)
        statusIcon = <div style={{display: "flex", justifyContent: "center"}}>
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M12.2933 9.30662L9.62892 7.53039C9.07512 7.16119 8.33333 7.55818 8.33333 8.22376V11.7762C8.33333 12.4418 9.07512 12.8388 9.62892 12.4696L12.2933 10.6934C12.788 10.3635 12.788 9.63648 12.2933 9.30662Z"
                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path
                    d="M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    else if (props.editTask.status === 2)
        statusIcon = <div style={{display: "flex", justifyContent: "center"}}>
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M6.66667 10H6.675M10 10H10.0083M13.3333 10H13.3417M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    else if (props.editTask.status === 3)
        statusIcon = <div style={{display: "flex", justifyContent: "center"}}>
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M7.5 10L9.16667 11.6667L12.5 8.33333M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>

    const taskStatusItems = [
        {
            key: 'taskStatusPlanned',
            label: (
                <div style={{display: "flex", gap: "2px", alignItems: 'center'}}>
                    <TaskPlannedStatusIcon/>
                    Запланировано
                </div>
            ),
            onClick: () => handleChangeStatus(0)
        },
        {
            key: 'taskStatusInWork',
            label: (
                <div style={{display: "flex", gap: "2px", alignItems: 'center'}}>
                    <TaskInWorkStatusIcon/>
                    В работе
                </div>
            ),
            onClick: () => handleChangeStatus(1)
        },
        {
            key: 'taskStatusWaiting',
            label: (
                <div style={{display: "flex", gap: "2px", alignItems: 'center'}}>
                    <TaskWaitingStatusIcon/>
                    Ожидание
                </div>
            ),
            onClick: () => handleChangeStatus(2)
        },
        {
            key: 'taskStatusCompleted',
            label: (
                <div style={{display: "flex", gap: "2px", alignItems: 'center'}}>
                    <TaskCompletedStatusIcon/>
                    Выполнено
                </div>
            ),
            onClick: () => handleChangeStatus(3)
        },
    ];

    useEffect(() => {
        dispatch(getTimeTrackingRecords(props.editTask.id))
    }, []);

    const closeTaskDrawer = () => {
        props.setEditTask(null)
        props.setOpenTaskDrawer(false);
    };

    const priorities = [
        {label: 'Незначительный', color: ""},
        {label: 'Низкий', color: "green"},
        {label: 'Средний', color: "yellow"},
        {label: 'Критичный', color: "red"},
        {label: 'Блокер', color: "red", variant: "filled"}
    ]

    const statuses = ["Запланировано", "В работе", "Ожидание", "Выполнено"]

    const taskOwnerUser = users.users.find(u => u.id === props.editTask.createUserID)
    const taskCreateDate = new Date(props.editTask.createDate);
    const taskCreateDateString = taskCreateDate.toLocaleDateString() + " " + taskCreateDate.toLocaleTimeString().slice(0, 5)

    return (
        <Drawer
            title="Редактирование задачи"
            width={700}
            onClose={closeTaskDrawer}
            open={props.openTaskDrawer}
            bodyStyle={{paddingBottom: 80}}
            extra={
                <Space>
                    <Button icon={<div>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="#FF4D4F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>}  type="text"
                            onClick={() => {
                                showDeleteTaskModal(closeTaskDrawer, dispatch, message, modal, props.editTask.id, props.editTask.name)
                            }}
                    />
                    {/*<Button disabled={!createNoteSubmittable} type="primary" onClick={() => {*/}
                    {/*    createNoteForm*/}
                    {/*        .validateFields()*/}
                    {/*        .then((values) => {*/}
                    {/*            // form.resetFields();*/}
                    {/*            handleCreateNote(values)*/}
                    {/*        })*/}
                    {/*        .catch((info) => {*/}
                    {/*            console.log('Validate Failed:', info);*/}
                    {/*        });*/}
                    {/*}}>*/}
                    {/*    Создать*/}
                    {/*</Button>*/}
                </Space>
            }
        >
            <Row style={{marginBottom: "20px"}}>
                <Col>
                    <Dropdown menu={{items: taskStatusItems}} placement="bottom"
                              onClick={() => console.log(1)}>
                        <div className={s.taskStatus}
                             style={{backgroundColor: props.editTask.status === 3 ? "rgb(9, 146, 104)" : "rgb(59, 91, 219)"}}
                        >
                            {
                                statusIcon
                            }
                            {
                                statuses[props.editTask.status]
                            }
                        </div>
                    </Dropdown>

                </Col>
                <Col flex={'auto'}>
                    <p className={s.taskOwnerInfo}>{taskOwnerUser.secondName + " " + taskOwnerUser.firstName}</p>
                    <p className={s.taskOwnerInfo}>{taskCreateDateString}</p>
                </Col>
            </Row>
            <div>
                <Typography.Title level={2}
                                  style={{margin: "0 0 30px 0"}}
                                  editable={{
                                      // tooltip: 'click to edit text',
                                      // onChange: setClickTriggerStr,
                                      onChange: (e) => handleChangeName(e),
                                      triggerType: "text",
                                      text: props.editTask.name === "" ? "" : undefined
                                  }}
                >
                    {
                        props.editTask.name !== '' ? props.editTask.name : "Без названия"
                    }
                </Typography.Title>
            </div>

            <div className={s.descriptions}>
                <div className={s.descriptionItem}>
                    <p className={s.descriptionItemName}>Описание:</p>
                    <Typography.Paragraph
                        className={classNames(s.descriptionItemValue, props.editTask.description === '' ? s.descriptionNotValue : "")}
                        editable={{
                            onChange: handleChangeDescription,
                            triggerType: "text",
                            text: props.editTask.description === "" ? "" : undefined
                        }}
                    >
                        {
                            props.editTask.description !== '' ?
                                props.editTask.description : "Без описания"
                        }
                    </Typography.Paragraph>
                </div>


                <div className={s.descriptionItem}>
                    <p className={s.descriptionItemName}>Категория:</p>
                    <TaskCategoryBadge id={props.editTask.categoryID}/>
                </div>

                <div className={s.descriptionItem}>
                    <p className={s.descriptionItemName}>Приоритет:</p>
                    <Badge color={priorities[props.editTask.priority].color}
                           variant={priorities[props.editTask.priority].variant || "light"}
                           size="sm">
                        {
                            priorities[props.editTask.priority].label
                        }
                    </Badge>
                </div>
            </div>
            <div className={s.timeTrackingContainer}>
                <div className={s.timeTrackingHeaderContainer}>
                    <div className={s.timeTrackingNameContainer}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                stroke="#9C9C9C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Учёт времени
                    </div>
                    <div className={s.timeTrackingHeaderButtonsContainer}>
                        <Cascader
                            options={time}
                            expandTrigger="hover"
                            onChange={(e) => handleCreateTimeTrackingRecord(e)}
                        >
                            <Button type="text"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "5px"
                                    }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M12 9V12M12 12V15M12 12H15M12 12H9M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                        stroke="#1677FF" stroke-width="2.5" stroke-linecap="round"
                                        stroke-linejoin="round"/>
                                </svg>
                                Добавить время
                            </Button>
                        </Cascader>
                        <Button type="text"
                                style={{display: "flex", alignItems: "center", justifyContent: "center", gap: "5px"}}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M14.7519 11.1679L11.5547 9.03647C10.8901 8.59343 10 9.06982 10 9.86852V14.1315C10 14.9302 10.8901 15.4066 11.5547 14.9635L14.7519 12.8321C15.3457 12.4362 15.3457 11.5638 14.7519 11.1679Z"
                                    stroke="#1677FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path
                                    d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                    stroke="#1677FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Таймер
                        </Button>
                    </div>
                </div>
                <div className={s.timeTrackingListContainer}>
                    {
                        timeTracking.isLoading ?
                            <Spin/> :
                            timeTracking.timeTrackingRecords.length > 0 ?
                                timeTracking.timeTrackingRecords.map(record => {
                                    return <TimeTrackingRow users={users.users} record={record}
                                                            taskID={props.editTask.id}/>
                                }) : <p className={s.noRecords}>Нет записей</p>
                    }
                </div>


            </div>

        </Drawer>
    )
}
