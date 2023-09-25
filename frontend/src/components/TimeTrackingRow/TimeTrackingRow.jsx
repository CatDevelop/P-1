import React from 'react'
import {App, Avatar, Col, ConfigProvider, DatePicker, Form, Row, Select, Typography} from "antd";
import s from "./TimeTrackingRow.module.css";
import locale from 'antd/locale/ru_RU';
import dayjs from "dayjs";
import classNames from 'classnames'
import {useDispatch} from "react-redux";
import {deleteTimeTrackingRecord, updateTimeTrackingRecord} from "../../store/slices/timeTrackingSlice";

export default function TimeTrackingRow(props) {

    let ownerUser = props.users.find(user => user.id === props.record.ownerID)
    const dispatch = useDispatch()
    const {message} = App.useApp();

    const time = [
        {value: 15, label: "15m"},
        {value: 30, label: "30m"},
        {value: 45, label: "45m"},
        {value: 60, label: "1h"},
        {value: 75, label: "1h 15m"},
        {value: 90, label: "1h 30m"},
        {value: 105, label: "1h 45m"},
        {value: 120, label: "2h"},
        {value: 135, label: "2h 15m"},
        {value: 150, label: "2h 30m"},
        {value: 165, label: "2h 45m"},
        {value: 180, label: "3h"},
        {value: 195, label: "3h 15m"},
        {value: 210, label: "3h 30m"},
        {value: 225, label: "3h 45m"},
        {value: 240, label: "4h"},
        {value: 255, label: "4h 15m"},
        {value: 270, label: "4h 30m"},
        {value: 285, label: "4h 45m"},
        {value: 300, label: "5h"},
        {value: 315, label: "5h 15m"},
        {value: 330, label: "5h 30m"},
        {value: 345, label: "5h 45m"},
        {value: 360, label: "6h"},
        {value: 375, label: "6h 15m"},
        {value: 390, label: "6h 30m"},
        {value: 405, label: "6h 45m"},
        {value: 420, label: "7h"},
        {value: 435, label: "7h 15m"},
        {value: 450, label: "7h 30m"},
        {value: 465, label: "7h 45m"},
        {value: 480, label: "8h"},
        {value: 495, label: "8h 15m"},
        {value: 510, label: "8h 30m"},
        {value: 525, label: "8h 45m"},
        {value: 540, label: "9h"},
        {value: 555, label: "9h 15m"},
        {value: 570, label: "9h 30m"},
        {value: 585, label: "9h 45m"},
        {value: 600, label: "10h"},
        {value: 615, label: "10h 15m"},
        {value: 630, label: "10h 30m"},
        {value: 645, label: "10h 45m"},
        {value: 660, label: "11h"},
        {value: 675, label: "11h 15m"},
        {value: 690, label: "11h 30m"},
        {value: 705, label: "11h 45m"},
        {value: 720, label: "12h"},
        {value: 735, label: "12h 15m"},
        {value: 750, label: "12h 30m"},
        {value: 765, label: "12h 45m"},
        {value: 780, label: "13h"},
        {value: 795, label: "13h 15m"},
        {value: 810, label: "13h 30m"},
        {value: 825, label: "13h 45m"},
        {value: 840, label: "14h"},
        {value: 855, label: "14h 15m"},
        {value: 870, label: "14h 30m"},
        {value: 885, label: "14h 45m"},
        {value: 900, label: "15h"},
        {value: 915, label: "15h 15m"},
        {value: 930, label: "15h 30m"},
        {value: 945, label: "15h 45m"},
        {value: 960, label: "16h"},
        {value: 975, label: "16h 15m"},
        {value: 990, label: "16h 30m"},
        {value: 1005, label: "16h 45m"},
        {value: 1020, label: "17h"},
        {value: 1035, label: "17h 15m"},
        {value: 1050, label: "17h 30m"},
        {value: 1065, label: "17h 45m"},
        {value: 1080, label: "18h"},
        {value: 1095, label: "18h 15m"},
        {value: 1110, label: "18h 30m"},
        {value: 1125, label: "18h 45m"},
        {value: 1140, label: "19h"},
        {value: 1155, label: "19h 15m"},
        {value: 1170, label: "19h 30m"},
        {value: 1185, label: "19h 45m"},
        {value: 1200, label: "20h"},
        {value: 1215, label: "20h 15m"},
        {value: 1230, label: "20h 30m"},
        {value: 1245, label: "20h 45m"},
        {value: 1260, label: "21h"},
        {value: 1275, label: "21h 15m"},
        {value: 1290, label: "21h 30m"},
        {value: 1305, label: "21h 45m"},
        {value: 1320, label: "22h"},
        {value: 1335, label: "22h 15m"},
        {value: 1350, label: "22h 30m"},
        {value: 1365, label: "22h 45m"},
        {value: 1380, label: "23h"},
        {value: 1395, label: "23h 15m"},
        {value: 1410, label: "23h 30m"},
        {value: 1425, label: "23h 45m"},
    ]

    const handleChangeDescription = (description) => {
        dispatch(updateTimeTrackingRecord({
            recordID: props.record.id,
            type: "Description",
            value: description,
            taskID: props.taskID,
        })).then(() => {
        }, () => {
            message.open({
                key: 'errorChangeDescription',
                type: 'error',
                content: "Ошибка изменения описания",
                duration: 2,
            });
        })
    }

    const handleChangeDate = (date) => {
        dispatch(updateTimeTrackingRecord({
            recordID: props.record.id,
            type: "Date",
            value: date,
            taskID: props.taskID,
        })).then(() => {
        }, () => {
            message.open({
                key: 'errorChangeDate',
                type: 'error',
                content: "Ошибка изменения даты",
                duration: 2,
            });
        })
    }

    const handleChangeTime = (time) => {
        dispatch(updateTimeTrackingRecord({
            recordID: props.record.id,
            type: "Time",
            value: time,
            taskID: props.taskID,
        })).then(() => {
        }, () => {
            message.open({
                key: 'errorChangeTime',
                type: 'error',
                content: "Ошибка изменения времени",
                duration: 2,
            });
        })
    }

    const handleDeleteRecord = () => {
        dispatch(deleteTimeTrackingRecord({
            recordID: props.record.id,
            taskID: props.taskID
        })).then(() => {
        }, () => {
            message.open({
                key: 'errorDeleteRecord',
                type: 'error',
                content: "Ошибка удаления записи учёта времени",
                duration: 2,
            });
        })
    }

    return (
        <Row className={s.container} wrap={false} gutter={5}>
            <Col flex={'auto'}>
                <Typography.Paragraph
                    className={classNames(s.description, !props.record.description ? s.noDescription : "")}
                    editable={{
                        triggerType: "text",
                        text: props.record.description === "" ? "" : undefined,
                        onChange: handleChangeDescription
                    }}
                >
                    {props.record.description || "Без описания"}
                </Typography.Paragraph>
            </Col>
            <Col>
                <ConfigProvider locale={locale}>
                    <DatePicker className={s.datePicker}
                                bordered={false}
                                format={"DD MMM, YYYY"}
                                defaultValue={dayjs(props.record.date)}
                                allowClear={false}
                                suffixIcon={<></>}
                                onChange={handleChangeDate}/>
                </ConfigProvider>
            </Col>
            <Col>
                <Select
                    value={props.record.time}
                    style={{width: 100}}
                    listHeight={200}
                    bordered={false}
                    options={time}
                    suffixIcon={<></>}
                    onChange={handleChangeTime}
                />
            </Col>
            <Col>
                <Avatar size={24}
                        src={"https://ren-design.ru/api/knowledge-base/1.0/files/avatars/" + ownerUser.avatar}/>
            </Col>
            <Col>
                <div className={s.deleteIcon}
                     style={{display: "flex", justifyContent: "center", alignItems: "center",}}
                     onClick={() => {
                         handleDeleteRecord()
                     }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 18L18 6M6 6L18 18" stroke="#BCBBBB" stroke-width="3" stroke-linecap="round"
                              stroke-linejoin="round"/>
                    </svg>
                </div>


            </Col>
        </Row>
    )
}
