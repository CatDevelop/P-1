import s from './TaskList.module.css';
import {App, Col, Dropdown, Form, Input, Row} from "antd";
import TaskListRow from "./TaskListRow";
import React from "react";
import {deleteNote} from "../../store/slices/noteSlice";
import {useDispatch} from "react-redux";
import {useAuth} from "../../hooks/use-auth";
import {createTask} from "../../store/slices/taskSlice";

export default function TaskList(props) {
    const {message, modal} = App.useApp();
    const dispatch = useDispatch()
    const user = useAuth()

    const [createTaskForm] = Form.useForm();

    const handleCreateTask = (taskName) => {
        if(taskName) {
            message.open({
                key: 'createTask', type: 'loading', content: 'Создаю задачу...'
            });

            dispatch(createTask({
                taskName: taskName,
                createUserID: user.id,
                type: "task"
            }))
                .then(payload => {
                    if (payload.error) {
                        message.open({
                            key: 'createTask', type: 'error', content: payload.payload, duration: 2,
                        });
                    } else {
                        message.open({
                            key: 'createTask', type: 'success', content: 'Задача успешно создана!', duration: 2,
                        });
                        createTaskForm.resetFields()
                    }
                })
        }
    }

    return (
        <div className={s.container}>
            <div className={s.taskListContainer}>
                <div className={s.addTaskContainer}>
                    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10 7.5V10M10 10V12.5M10 10H12.5M10 10H7.5M17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5"
                            stroke="#9C9C9C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5" stroke="#9C9C9C" strokeWidth="2"
                              strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3"/>
                    </svg>

                    <Form layout="vertical" hideRequiredMark form={createTaskForm} noStyle={true}
                    style={{width: "100%"}}>
                        <Form.Item name="createTaskName" noStyle={true}>
                            <Input placeholder={"Новая задача"}
                                   bordered={false}
                                   className={s.addTaskInput}
                                   onPressEnter={(e) => handleCreateTask(e.target.value)}
                            />
                        </Form.Item>
                    </Form>
                </div>
                {
                    props.tasks.filter(task => task.type !== "subtask").map(task => {
                        return <TaskListRow task={task}
                                            users={props.users}
                                            setEditTask={props.setEditTask}
                                            setOpenTaskDrawer={props.setOpenTaskDrawer}
                        />
                    })
                }
            </div>
        </div>
    )
}
