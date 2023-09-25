import React from 'react';
import s from './SchemeCard.module.css'
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    SettingOutlined,
    SwapOutlined,
    ToolOutlined
} from '@ant-design/icons';
import {App, Avatar, Card, Dropdown, Tag} from 'antd';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../hooks/use-auth";
import {useDispatch} from "react-redux";

const {Meta} = Card;

function SchemeCard(props) {
    const {message, modal} = App.useApp();
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useAuth()
    const items = [
        props.type === "scheme" ? {
            label: 'Посмотреть схему',
            icon: <EyeOutlined/>,
            key: 'goToScheme',
            onClick: () => {
                props.setContextMenuID(null)
                props.setSelectScheme(props.scheme);
                props.openPreview()
            }
        } : null,
        props.type === "scheme" && props.owner.id === user.id ? {
            label: 'Редактировать схему',
            icon: <EditOutlined/>,
            key: 'editScheme',
            onClick: () => navigate("/scheme/"+props.id)
        } : null,

        props.type === "scheme" && props.owner.id === user.id ? {
            label: 'Удалить схему',
            icon: <DeleteOutlined/>,
            key: 'deleteScheme',
            onClick: () => {
                props.setContextMenuID(null)
                props.showDeleteSchemeModal(dispatch, message, modal, props.id, props.title)
            }
        } : null,
    ];

    return (
        <Dropdown menu={{items}} trigger={['contextMenu']} id={props.id}
                  open={props.contextMenuID === (props.type === "group" ? "g" + props.id : props.id)}
                  onOpenChange={() => props.setContextMenuID(props.contextMenuID === (props.type === "group" ? "g" + props.id : props.id) ? null : (props.type === "group" ? "g" + props.id : props.id))}>
        <Card style={{width: 300, height: 124}}
              bodyStyle={{padding: "12px"}}
              className={s.noteCard}
              hoverable={true}
              // onClick={() => {
              //     if (props.type === "group")
              //         navigate("/notes/" + props.id)
              //     else
              //         navigate("/network/note/" + props.id)
              // }}
        >
            <div className={s.schemeCardPreview} onClick={() => {
                props.setSelectScheme(props.scheme);
                props.openPreview()
            }}>
                <div className={s.blogMeta}>
                    <div>
                        <p className={s.blogData}>{props.type === "scheme" ? props.date : "Серия схем"}</p>
                        <div className={props.type === "scheme" ? s.divider : s.groupDivider}></div>
                        <h2 className={s.blogTitle}>{props.title}</h2>
                    </div>
                    <div className={s.noteBottom}>
                        {
                            props.type === "scheme" ?
                                <div className={s.schemeUser}>
                                    <Avatar
                                        src={"https://ren-design.ru/api/knowledge-base/1.0/files/avatars/" + props.owner.avatar}
                                        size={24}/>
                                    <div
                                        className={s.schemeUserName}>{props.owner.secondName + " " + props.owner.firstName}</div>
                                </div> : <></>
                        }
                    </div>
                </div>
            </div>
        </Card>
        </Dropdown>



















        // <div className={s.schemeCard}>
        //     <div className={s.schemeCardPreview} onClick={()=>{props.setSelectScheme(props.scheme);props.openPreview()}}>
        //         <div className={s.schemeMeta}>
        //             <div className={s.schemeUser}>
        //                 <Avatar
        //                     src={"https://ren-design.ru/api/knowledge-base/1.0/files/avatars/" + props.owner.avatar}
        //                     size={24}/>
        //                 <div className={s.schemeUserName}>{props.owner.secondName + " " + props.owner.firstName}</div>
        //             </div>
        //             <div className={s.schemeTitle}>{props.title}</div>
        //
        //         </div>
        //     </div>
        //     <div className={s.cardToolBar}>
        //         <div className={s.cardTool} onClick={e=>{
        //             console.log("123")
        //             if (!e) e = window.event;
        //             e.cancelBubble = true;
        //             if (e.stopPropagation) e.stopPropagation();
        //         }} >
        //             <SettingOutlined key="setting" />
        //         </div>
        //         <div className={s.cardTool} onClick={e=>{
        //             navigate("/scheme/"+props.id)
        //             if (!e) e = window.event;
        //             e.cancelBubble = true;
        //             if (e.stopPropagation) e.stopPropagation();
        //         }}>
        //             <EditOutlined key="edit" />
        //         </div>
        //
        //
        //     </div>
        // </div>
        // <Card
        //     style={{
        //         width: 300
        //     }}
        //     bodyStyle={{
        //         padding: "12px",
        //     }}
        //     cover={
        //         <img
        //             alt="example"
        //             src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
        //         />
        //     }
        //     actions={[
        //         <SettingOutlined key="setting" onClick={e=>{
        //             console.log("123")
        //             if (!e) e = window.event;
        //             e.cancelBubble = true;
        //             if (e.stopPropagation) e.stopPropagation();
        //         }} />,
        //         <EditOutlined key="edit" onClick={e=>{
        //             navigate("/scheme/1")
        //             if (!e) e = window.event;
        //             e.cancelBubble = true;
        //             if (e.stopPropagation) e.stopPropagation();
        //         }}/>
        //     ]}
        //     hoverable={true}
        //     onClick={()=>{props.setSelectScheme(props.scheme);props.openPreview()}}
        // >


        // {/*<Meta*/}
        // {/*    avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" size={32}/>}*/}
        // {/*    title="Card title"*/}
        // {/*    description="This is the description"*/}
        // {/*    style={{padding: '0'}}*/}
        // {/*/>*/}
        // </Card>
    )
}

export default SchemeCard;
