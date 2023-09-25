import React from "react";
import {ExclamationCircleFilled} from "@ant-design/icons";
import {deleteNoteFromSeries} from "../../store/slices/noteSlice";


export default function showDeleteNoteFromSeriesModal (dispatch, message, modal, noteID, seriesID, title) {
    const handleDeleteNoteFromSeries = (props) => {
        message.open({
            key: 'deleteNoteFromSeries', type: 'loading', content: 'Удаляю серию статей...'
        });
        dispatch(deleteNoteFromSeries({
            noteID, seriesID
        })).then(payload => {
            if (payload.error) {
                message.open({
                    key: 'deleteNoteFromSeries', type: 'error', content: payload.payload, duration: 2,
                });
            } else {
                message.open({
                    key: 'deleteNoteFromSeries',
                    type: 'success',
                    content: 'Cтатья успешно удалена из серии!',
                    duration: 2,
                });
            }
        })
    }

    modal.confirm({
        title: 'Удалить статью \"' + title + "\" из серии?",
        icon: <ExclamationCircleFilled/>,
        content: 'Статья перенесётся в общий пулл',
        okText: "Удалить",
        cancelText: "Отмена",
        centered: true,

        onOk() {
            handleDeleteNoteFromSeries()
        }
    });
}
