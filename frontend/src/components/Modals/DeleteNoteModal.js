import React from "react";
import {ExclamationCircleFilled} from "@ant-design/icons";
import {deleteNote} from "../../store/slices/noteSlice";


export default function showDeleteNoteModal(dispatch, message, modal, noteID, seriesID, title) {
    const handleDeleteNote = (props) => {
        message.open({
            key: 'deleteNote', type: 'loading', content: 'Удаляю статью...'
        });

        dispatch(deleteNote({noteID, seriesID}))
            .then(payload => {
                if (payload.error) {
                    message.open({
                        key: 'deleteNote', type: 'error', content: payload.payload, duration: 2,
                    });
                } else {
                    message.open({
                        key: 'deleteNote', type: 'success', content: 'Cтатья успешно удалена!', duration: 2,
                    });
                }
            })
    }

    modal.confirm({
        title: 'Удалить статью \"' + title + "\"?",
        icon: <ExclamationCircleFilled/>,
        content: 'Данное действие необратимо. Будьте аккуратны',
        okText: "Удалить",
        cancelText: "Отмена",
        centered: true,

        onOk() {
            handleDeleteNote()
        }
    });
}
