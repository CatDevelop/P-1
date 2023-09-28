import React, {useEffect, useState} from 'react';
import TasksColumn from './TasksColumn';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import s from "./TasksBoard.module.css"
import {updateTask} from "../../store/slices/taskSlice";
import {useDispatch} from "react-redux";
import {App} from "antd";

const TasksBoard = (props) => {
    const dispatch = useDispatch()
    const {message} = App.useApp();

    const [boardsData, setBoardsData] = useState(props.tasks)
    useEffect(() => {
        setBoardsData(props.tasks)
    }, [props.tasks]);

    const toDoTasks = boardsData.filter(task => task.status === 0)
    const inWorkTasks = boardsData.filter(task => task.status === 1)
    const waitingTasks = boardsData.filter(task => task.status === 2)
    const completedTasks = boardsData.filter(task => task.status === 3)

    const onDragEnd = (result) => {
        const taskBoardsID = {
            "taskBoard0": 0,
            "taskBoard1": 1,
            "taskBoard2": 2,
            "taskBoard3": 3
        }

        const taskBoards = {
            "taskBoard0": toDoTasks,
            "taskBoard1": inWorkTasks,
            "taskBoard2": waitingTasks,
            "taskBoard3": completedTasks
        }


        console.log(result)
        const { destination, source, draggableId} = result;
        if (!destination)
            return;
        if (destination.droppableId === source.droppableId)
        {
            if(destination.index === source.index)
                return;
            else {
                console.log("Изменяю порядок задачи с ID " + draggableId + "\n" + boardsData.filter(task => task.id === draggableId)[0].name + "\nНа место " +destination.index)
                return;
            }
        }

        // Внедрение логики для обновления порядка задач

        console.log("Перемещаю задачу с ID " + draggableId + "\n" + boardsData.filter(task => task.id === draggableId)[0].name + "\nНа доску " +taskBoardsID[destination.droppableId])
        let oldStatus = taskBoardsID[source.droppableId]
        setBoardsData([...boardsData.filter(task => task.id !== draggableId), {...boardsData.filter(task => task.id === draggableId)[0], status: taskBoardsID[destination.droppableId]}])
        dispatch(updateTask({
            taskID: draggableId,
            type: "Status",
            value: taskBoardsID[destination.droppableId]
        })).then(() => {}, () => {
            setBoardsData([...boardsData.filter(task => task.id !== draggableId), {...boardsData.filter(task => task.id === draggableId)[0], status: oldStatus}])
            message.open({
                key: 'errorChangeStatus',
                type: 'error',
                content: "Ошибка изменения статуса",
                duration: 2,
            });
        })
    };

    console.log("boardsData", boardsData)

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className={s.tasksBoard}>
                <TasksColumn key={"taskBoard0"}
                             id={0}
                             title={"Запланировано"}
                             tasks={toDoTasks}
                             users={props.users}
                             setEditTask={props.setEditTask}
                             setOpenTaskDrawer={props.setOpenTaskDrawer}
                />
                <TasksColumn key={"taskBoard1"}
                             id={1}
                             title={"В работе"}
                             tasks={inWorkTasks}
                             users={props.users}
                             setEditTask={props.setEditTask}
                             setOpenTaskDrawer={props.setOpenTaskDrawer}
                />
                <TasksColumn key={"taskBoard2"}
                             id={2}
                             title={"Ожидание"}
                             tasks={waitingTasks}
                             users={props.users}
                             setEditTask={props.setEditTask}
                             setOpenTaskDrawer={props.setOpenTaskDrawer}
                />
                <TasksColumn key={"taskBoard3"}
                             id={3}
                             title={"Выполнено"}
                             tasks={completedTasks}
                             users={props.users}
                             setEditTask={props.setEditTask}
                             setOpenTaskDrawer={props.setOpenTaskDrawer}
                />
            </div>
        </DragDropContext>
    );
};
export default TasksBoard;
