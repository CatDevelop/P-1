import React from "react";
import {CloseCircleFilled, CloseCircleTwoTone, ExclamationCircleFilled} from "@ant-design/icons";
import {deleteNoteSeries} from "../../store/slices/noteSlice";
import {Button} from "antd";


export default function showDeleteNoteSeriesModal(dispatch, message, modal, noteSeriesID, seriesID, title) {
    const handleDeleteNoteSeries = (props) => {
        message.open({
            key: 'deleteNoteSeries', type: 'loading', content: 'Удаляю серию статей...'
        });
        dispatch(deleteNoteSeries({noteSeriesID, seriesID}))
            .then(payload => {
                if (payload.error) {
                    message.open({
                        key: 'deleteNoteSeries',
                        type: 'error',
                        content: payload.payload,
                        duration: 2,
                    });
                } else {
                    console.log(payload)
                    message.open({
                        key: 'deleteNoteSeries',
                        type: 'success',
                        content: 'Серия статей успешно удалена!',
                        duration: 2,
                    });
                }
            })
    }

    modal.confirm({
        title: 'Удалить серию статей \"' + title + "\"?",
        icon: <ExclamationCircleFilled/>,
        content: 'Данное действие необратимо. Все статьи перенесутся в общий пулл. Будьте аккуратны',
        okText: "Удалить",
        cancelText: "Отмена",
        centered: true,

        onOk() {
            handleDeleteNoteSeries()
        },
    })
}
