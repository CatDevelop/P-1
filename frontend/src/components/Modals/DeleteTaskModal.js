import React from "react";
import {ExclamationCircleFilled} from "@ant-design/icons";
import {deleteNote} from "../../store/slices/noteSlice";
import {deleteTask} from "../../store/slices/taskSlice";


export default function showDeleteTaskModal(closeTaskDrawer, dispatch, message, modal, taskID, name) {
    const handleDeleteTask = (props) => {
        message.open({
            key: 'deleteTask', type: 'loading', content: 'Удаляю статью...'
        });

        dispatch(deleteTask(taskID))
            .then(() => {
                message.open({
                    key: 'deleteTask', type: 'success', content: 'Задача успешно удалена!', duration: 2,
                });
                closeTaskDrawer()
            }, () => {
                message.open({
                    key: 'deleteTask', type: 'error', content: "Не удалось удалить задачу!", duration: 2,
                });
            })
    }

    modal.confirm({
        title: 'Удалить задачу \"' + name + "\"?",
        icon: <ExclamationCircleFilled/>,
        content: 'Данное действие необратимо. Будьте аккуратны',
        okText: "Удалить",
        cancelText: "Отмена",
        centered: true,

        onOk() {
            handleDeleteTask()
        }
    });
}
