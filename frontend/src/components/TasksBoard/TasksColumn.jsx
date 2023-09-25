import React, {useState} from 'react';
import TaskCard from './TaskCard';
import {Droppable} from "react-beautiful-dnd";
import s from './TasksBoard.module.css'
import {Button} from "antd";
const TasksColumn = (props) => {
    let statusIcon;
    if (props.id === 0)
        statusIcon = <div style={{display: "flex", justifyContent: "center"}}>
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
                    stroke="#9C9C9C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    else if (props.id === 1)
        statusIcon = <div style={{display: "flex", justifyContent: "center"}}>
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M12.2933 9.30662L9.62892 7.53039C9.07512 7.16119 8.33333 7.55818 8.33333 8.22376V11.7762C8.33333 12.4418 9.07512 12.8388 9.62892 12.4696L12.2933 10.6934C12.788 10.3635 12.788 9.63648 12.2933 9.30662Z"
                    stroke="#9C9C9C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path
                    d="M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
                    stroke="#9C9C9C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    else if (props.id === 2)
        statusIcon = <div style={{display: "flex", justifyContent: "center"}}>
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M6.66667 10H6.675M10 10H10.0083M13.3333 10H13.3417M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
                    stroke="#9C9C9C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    else if (props.id === 3)
        statusIcon = <div style={{display: "flex", justifyContent: "center"}}>
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M7.5 10L9.16667 11.6667L12.5 8.33333M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
                    stroke="#9C9C9C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>


    const [columnData, setColumnData] = useState(props.tasks)

    console.log("Задачи на доске " + props.id, props.tasks)
    return (
        <div className={s.tasksColumnContainer}>
            <div className={s.tasksColumn}>
                <div className={s.tasksColumnTitleContainer}>
                    {statusIcon}
                    <h3 className={s.tasksColumnTitle}>{props.title}</h3>
                </div>



                <Droppable droppableId={"taskBoard"+props.id} isCombineEnabled>
                    {(provided) => (
                        <div
                            className={s.tasksColumnList}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {props.tasks.map((task, i) => <TaskCard key={'taskCard'+task.id}
                                                            id={task.id}
                                                            index={i}
                                                            task={task}
                                                            users={props.users}
                                                            setEditTask={props.setEditTask}
                                                            setOpenTaskDrawer={props.setOpenTaskDrawer}
                                />)}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>

            <Button className={s.taskColumnAddTaskButton} type="text">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4V20M20 12L4 12" stroke="white" strokeOpacity="0.85" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Добавить задачу
            </Button>
        </div>
    );
};
export default TasksColumn;
