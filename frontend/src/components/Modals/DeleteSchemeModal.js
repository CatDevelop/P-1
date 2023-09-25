import React from "react";
import {ExclamationCircleFilled} from "@ant-design/icons";
import {deleteNote} from "../../store/slices/noteSlice";
import {deleteScheme} from "../../store/slices/schemeSlice";


export default function showDeleteSchemeModal(dispatch, message, modal, schemeID, title) {
    const handleDeleteScheme = (props) => {
        message.open({
            key: 'deleteScheme', type: 'loading', content: 'Удаляю схему...'
        });

        dispatch(deleteScheme(schemeID))
            .then(payload => {
                if (payload.error) {
                    message.open({
                        key: 'deleteScheme', type: 'error', content: payload.payload, duration: 2,
                    });
                } else {
                    message.open({
                        key: 'deleteScheme', type: 'success', content: 'Схема успешно удалена!', duration: 2,
                    });
                }
            })
    }

    modal.confirm({
        title: 'Удалить схему \"' + title + "\"?",
        icon: <ExclamationCircleFilled/>,
        content: 'Данное действие необратимо. Будьте аккуратны',
        okText: "Удалить",
        cancelText: "Отмена",
        centered: true,

        onOk() {
            handleDeleteScheme()
        }
    });
}
