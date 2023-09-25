import React from 'react';
import s from './SchemeCard.module.css'
import { EditOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import {useNavigate} from "react-router-dom";
const { Meta } = Card;

function SchemeCard(props) {
    const navigate = useNavigate()
    return (
        <Card
            style={{
                width: 300
            }}
            bodyStyle={{
                padding: "12px",
            }}
            cover={
                <img
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
            }
            actions={[
                <SettingOutlined key="setting" onClick={e=>{
                    console.log("123")
                    if (!e) e = window.event;
                    e.cancelBubble = true;
                    if (e.stopPropagation) e.stopPropagation();
                }} />,
                <EditOutlined key="edit" onClick={e=>{
                    navigate("/scheme/1")
                    if (!e) e = window.event;
                    e.cancelBubble = true;
                    if (e.stopPropagation) e.stopPropagation();
                }}/>
            ]}
            hoverable={true}
            onClick={()=>{props.setSelectScheme(props.scheme);props.openPreview()}}
        >
            <div className={s.schemeMeta}>
                <div className={s.schemeUser}>
                    <Avatar
                        src={"https://ren-design.ru/api/knowledge-base/1.0/files/avatars/" + props.owner.avatar}
                        size={24}/>
                    <div className={s.schemeUserName}>{props.owner.secondName + " " + props.owner.firstName}</div>
                </div>
                <div className={s.schemeTitle}>{props.title}</div>

            </div>

            {/*<Meta*/}
            {/*    avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" size={32}/>}*/}
            {/*    title="Card title"*/}
            {/*    description="This is the description"*/}
            {/*    style={{padding: '0'}}*/}
            {/*/>*/}
        </Card>
    )
}

export default SchemeCard;
