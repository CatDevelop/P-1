import {createReactEditorJS} from 'react-editor-js'
import React, {useCallback, useEffect, useState} from "react";
import s from "./EditorJS.module.css"
import MermaidTool from 'editorjs-mermaid'
import {useDirectories} from "../../hooks/use-directories";
import {EditOutlined, SaveOutlined} from "@ant-design/icons";
import {setConnectToServer, setSelectElement, setSelectFilePath} from "../../store/slices/localSlice";
import {App, Button, FloatButton, Input, Space, Tooltip} from "antd";
import {useDispatch} from "react-redux";
import {EDITOR_JS_TOOLS, i18n} from "./config";
import io from "socket.io-client";
import {useServer} from "../../hooks/use-server";

const _ = require('lodash');


const socket = io.connect("ws://localhost:3001", {
    'reconnection': true,
    'reconnectionDelay': 500,
    'reconnectionAttempts': 10
});

const keyMap = {
    SAVE: "command+s"
};

function NetworkEditorJS(props) {
    const {message} = App.useApp();
    const dispatch = useDispatch()
    let ReactEditorJS = createReactEditorJS();
    const directories = useDirectories()
    const server = useServer()
    const editorCore = React.useRef(null);

    const [fileName, setFileName] = useState(directories.selectFilePath.split("\\").at(-1).slice(0, -4))
    const [isFileNameEdit, setIsFileNameEdit] = useState(false)

    let blocks = props.notes.blocks.slice()


    const handleInitialize = (instance) => {
        console.log("handleInitialize")
        editorCore.current = instance
    }

    const handleReady = () => {
        MermaidTool.config({'theme': 'neutral'})
    };

    const onChange = (e) => {
        setFileName(e.target.value)
    }

    const setterFileName = () => {
        if (fileName.trim().length !== 0) {
            ipcRenderer.send('renameFile', {
                path: directories.selectFilePath,
                name: directories.selectFolderPath + "\\" + fileName.trim() + ".txt"
            });
            dispatch(setSelectElement(directories.selectFolderPath + "\\" + fileName.trim() + ".txt"))
            dispatch(setSelectFilePath(directories.selectFolderPath + "\\" + fileName.trim() + ".txt"))
            setFileName(fileName.trim())
        } else {
            setFileName(directories.selectFilePath.split("\\").at(-1).slice(0, -4))
            message.error('Введите название файла!');
        }
        setIsFileNameEdit(false)
    }


    // useEffect(() => {
    //     ipcRenderer.removeAllListeners('renameFileResultError')
    //     ipcRenderer.removeAllListeners('shortcutS')
    //     ipcRenderer.on('renameFileResultError', (event, content) => {
    //         setFileName(directories.selectFilePath.split("\\").at(-1).slice(0, -4))
    //         message.error('Файл уже существует!');
    //     })
    //     ipcRenderer.on('shortcutS', (event, content) => {
    //         handleSave()
    //         message.success('Статья успешно сохранена!');
    //     })
    //
    //     joinRoom(props.room)
    // }, [])


    const save = useCallback(() => {
        handleSave()
        message.success('Статья успешно сохранена!');
    }, [])

    const schortcutHandlers = {
        SAVE: save
    };


    const handleSave = async () => {
        try {
            const savedData = await editorCore.current.save();

            let savedBlocks = savedData?.blocks

            const changed = savedBlocks.filter(newItem => {
                const oldItem = blocks.find(o => o.id === newItem.id)
                return !_.isEqual(newItem, oldItem)
            })

            const changedWithPlace = changed.map(block => {
                return {...block, place: savedBlocks.findIndex(x => x.id === block.id)}
            })

            const deleted = blocks.filter(oldItem => {
                const newItem = savedBlocks.find(n => n.id === oldItem.id)
                return !_.isEqual(newItem, oldItem)
            }).filter(item => {
                const l = changed.find(cd => cd.id === item.id)
                return !l
            })

            if (changed.length !== 0) {
                console.log("[EDITOR] Блоки до обновления: ", blocks)
                console.log("[EDITOR] Данные для обновления: ", savedData)
                console.log("[EDITOR] Блоки, которые я изменил: ", changedWithPlace)
                socket.emit("editBlocks", {blocks: changedWithPlace, room: props.room});
                console.log("[USER] Отправил блоки ", changedWithPlace, " на изменения. Комната №", props.room)
            }

            if (deleted.length !== 0) {
                console.log("[EDITOR] Блоки до обновления: ", blocks)
                console.log("[EDITOR] Данные для обновления: ", savedData)
                console.log("[EDITOR] Блоки, которые я удалил: ", deleted)
                socket.emit("deleteBlocks", {blocks: deleted, room: props.room});
                console.log("[USER] Отправил блоки ", deleted, " на удаление. Комната №", props.room)
            }


            if (changed.length !== 0 || deleted.length !== 0) {
                blocks = [...savedData.blocks]
                console.log("[EDITOR] Блоки после обновления: ", blocks)
            }
        } catch (reason) {
            console.log(`Editor.js error: ${reason}`)
        }
    }

    const joinRoom = (room) => {
        console.log("[USER] Запрашиваю подключение к комнате №", room)
        if (room !== "" && !server.isConnect) {
            socket.emit("join_room", {room: props.room});
            dispatch(setConnectToServer({isConnectToServer: true}))
            console.log("[USER] Присоединился к комнате №", room)
        }
    };

    const editBlocks = (editBlocks) => {


        editBlocks.map(block => {
            let place = block.place
            delete block.place;
            if (!blocks[place]) {
                console.log("[EDITOR] Тип действия - push, позиция блока - ", place, " блок - ", block)
                blocks = [...blocks, block]
            } else {
                if (blocks[place].id !== block.id) {
                    console.log("[EDITOR] Тип действия - insert, позиция блока - ", place, " блок - ", block)
                    blocks.splice(place, 0, block);
                } else {
                    console.log("[EDITOR] Тип действия - edit, позиция блока - ", place, " блок - ", block)
                    blocks[place] = {...block}
                }

            }
        })
        console.log("[EDITOR] Блоки после обновления: ", blocks)
        editorCore.current.save().then(savedData => {
            editorCore.current._editorJS.render({...savedData, blocks: blocks})
        });
    }

    const deleteBlocks = (editBlocks) => {
        console.log("[EDITOR] Блоки до обновления: ", blocks)

        editBlocks.map(block => {
            console.log("[EDITOR] Тип действия - delete, блок - ", block)
            blocks = blocks.filter(b => b.id !== block.id)
        })
        console.log("[EDITOR] Блоки после обновления: ", blocks)
        editorCore.current.save().then(savedData => {
            editorCore.current._editorJS.render({...savedData, blocks: blocks})
        });
    }


    useEffect(() => {
        socket.on("editBlocks", (data) => {
            console.log("[SERVER] На странице изменили блоки: ", data.blocks)
            editBlocks(data.blocks)
        });

        socket.on("deleteBlocks", (data) => {
            console.log("[SERVER] На странице удалили блоки: ", data.blocks)
            deleteBlocks(data.blocks)
        });

        socket.on('disconnect', (data) => {
            console.log('disconnect...')
            dispatch(setConnectToServer(false))
        })

        socket.on('connect', () => {
            socket.emit("join_room", {room: props.room});
        })
    }, [socket]);


    return (<div className={s.editor}>
        <div className={s.noteTitleContainer}>
            {
                isFileNameEdit ? <Space.Compact style={{width: '100%'}} className={s.noteTitle}>
                        <Input placeholder="File name" onChange={onChange} value={fileName}
                               onPressEnter={() => setterFileName()}/>
                        <Button type="primary" onClick={() => setterFileName()}>Submit</Button>
                    </Space.Compact> :
                    <Space.Compact style={{width: '100%'}} className={s.noteTitle}>
                        <Input placeholder="File name" value={fileName} disabled={true}/>
                        <Button type="primary" onClick={() => {
                            setIsFileNameEdit(true)
                        }}>Edit</Button>
                    </Space.Compact>
            }
            {/*<h1 className={s.noteTitle}>{directories.selectFilePath.split("\\").at(-1).slice(0, -4)}</h1>*/}
        </div>
        <HotKeys keyMap={keyMap} handlers={schortcutHandlers}>
            <ReactEditorJS defaultValue={props.notes}
                           tools={EDITOR_JS_TOOLS}
                           placeholder={"Нажмите + или Tab, чтобы выбрать блок"}
                           i18n={i18n}
                           autofocus={true}
                           onInitialize={handleInitialize}
                           onReady={handleReady}
                           onChange={handleSave}
                           preserveBlank={true}
                // holder="editorId"
            />
        </HotKeys>

        <FloatButton.Group shape="square">
            <Tooltip placement="left" title={"Сохранить статью"} arrow={false}>
                <FloatButton icon={<SaveOutlined/>} type="default" onClick={() => {
                    message.loading({content: 'Статья сохраняется на сервер...', key: "saveNote"});
                    handleSave().then(() => {
                        message.success({content: 'Статья успешно сохранена!', key: "saveNote"});
                    })

                }}/>
            </Tooltip>
        </FloatButton.Group>
    </div>)
}

export default NetworkEditorJS;
