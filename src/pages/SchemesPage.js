import s from "./Pages.module.css";
import FirstMenu from "../components/Menu/Menu";
import React, {useEffect, useState} from "react";
import SchemeCard from "../components/SchemeCard/SchemeCard";
import {Breadcrumb, FloatButton, Modal, Spin, Tooltip} from "antd";
import SchemePreview from "../components/SchemePreview/SchemePreview";
import {useSchemes} from "../hooks/use-schemes";
import {useDispatch} from "react-redux";
import {getSchemes} from "../store/slices/schemesSlice";
import {removeScheme} from "../store/slices/schemeSlice";
import {removeNote} from "../store/slices/noteSlice";
import {getUsers} from "../store/slices/usersSlice";
import {useUsers} from "../hooks/use-users";
import {FileAddOutlined} from "@ant-design/icons";
import CreateSchemeDrawer from "../components/Drawers/CreateSchemeDrawer";
import {removeTasks} from "../store/slices/tasksSlice";
import showDeleteSchemeModal from "../components/Modals/DeleteSchemeModal"

export const SchemesPage = () => {
    console.log("RENDER")
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectScheme, setSelectScheme] = useState(null)
    const [contextMenuID, setContextMenuID] = useState(null)
    const dispatch = useDispatch()
    const schemes = useSchemes();
    const users = useUsers();
    console.log(schemes)


    const [openCreateSchemeDrawer, setOpenCreateSchemeDrawer] = useState(false);

    const showCreateSchemeDrawer = () => {
        setOpenCreateSchemeDrawer(true);
    };


    useEffect(() => {
        dispatch(getSchemes())
        dispatch(getUsers())
        dispatch(removeScheme())
        dispatch(removeNote())
        dispatch(removeTasks())
    }, [])

    const showModal = () => {
        setIsModalOpen(true);
    };

    const hideModal = () => {
        setIsModalOpen(false);
        setSelectScheme(null)
    };

    return (
        <div>
            <div className={s.mainContainer}>
                <FirstMenu selectedKeys={["Schemes"]}/>
                {/*<Transition>*/}
                <Breadcrumb
                    separator=">"
                    items={[{
                        title: "Схемы"
                    }]}
                />
                <div className={s.schemes}>
                    {
                        !schemes.isLoading && !users.isLoading ? schemes.schemes.length > 0 ? schemes.schemes.map(scheme => {
                            let date = new Date(scheme.creationDate ?? "2023-06-25 07:09:37");
                            let dateArray = date.toDateString().split(" ")
                            return <SchemeCard id={scheme.id}
                                               key={scheme.id}
                                               title={scheme.title}
                                               scheme={scheme.scheme}
                                               type={"scheme"}
                                               openPreview={showModal}
                                               owner={users.users.find(user => user.id === scheme.ownerId)}
                                               setSelectScheme={setSelectScheme}
                                               contextMenuID={contextMenuID}
                                //date={scheme.type === "scheme" ? dateArray[1] + " " + dateArray[2] + ", " + dateArray[3] : null}
                                               date={true ? dateArray[1] + " " + dateArray[2] + ", " + dateArray[3] : null}
                                               setContextMenuID={setContextMenuID}
                                               showDeleteSchemeModal={showDeleteSchemeModal}
                            />
                        }) : <Spin style={{gridColumn: "2"}}/> : <p>Нет схем</p>
                    }
                </div>
                {/*</Transition>*/}

                {
                    selectScheme ?
                        <Modal title="Тестовая схема" open={isModalOpen} width={1059} onCancel={hideModal} footer={[]}
                               centered>
                            <SchemePreview selectScheme={JSON.parse(selectScheme)} setSelectScheme={setSelectScheme}/>
                        </Modal> : <></>
                }

                <FloatButton.Group shape="square">

                    <Tooltip placement="left" title={"Создать схему"} arrow={false}>
                        <FloatButton icon={<FileAddOutlined/>} type="default" onClick={() => {
                            showCreateSchemeDrawer()
                        }}/>
                    </Tooltip>
                </FloatButton.Group>

                <CreateSchemeDrawer openCreateSchemeDrawer={openCreateSchemeDrawer}
                                    setOpenCreateSchemeDrawer={setOpenCreateSchemeDrawer}
                />


            </div>
        </div>
    )
}
