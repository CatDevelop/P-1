import {createReactEditorJS} from 'react-editor-js'
import React, {useCallback, useEffect, useState} from "react";
import s from "./EditorJS.module.css"
import MermaidTool from 'editorjs-mermaid'
import {useDirectories} from "../../hooks/use-directories";
import {EditOutlined, EyeOutlined, SaveOutlined} from "@ant-design/icons";
import {setSelectElement, setSelectFilePath} from "../../store/slices/localSlice";
import {App, Button, FloatButton, Input, Space, Tooltip} from "antd";
import {useDispatch} from "react-redux";
import {EDITOR_JS_TOOLS, i18n} from "./config";
import {updateNote} from "../../store/slices/noteSlice";
import _ from "lodash";
import {useNavigate} from "react-router-dom";
import {HotKeys} from "react-hotkeys";


const keyMap = {
    SAVE: "command+s"
};

function EditorJS(props) {
    const {message} = App.useApp();
    const dispatch = useDispatch()
    const navigate = useNavigate()
    let ReactEditorJS = createReactEditorJS();
    // const directories = useDirectories()
    const editorCore = React.useRef(null);
    let blocks = props.notes.blocks.slice()

    // const [fileName, setFileName] = useState(directories.selectFilePath.split("\\").at(-1).slice(0, -4))
    // const [isFileNameEdit, setIsFileNameEdit] = useState(false)

    const handleInitialize = (instance) => {
        console.log("handleInitialize")
        editorCore.current = instance
    }

    const save = useCallback(() => {
        message.loading({content: 'Статья сохраняется на сервер...', key: "saveNote"});
        handleSave().then(() => {
            message.success({content: 'Статья успешно сохранена!', key: "saveNote"});
        })
    }, [])

    const shortcutHandlers = {
        SAVE: save
    };


    // useEffect(() => {
    //     // setFileName(directories.selectFilePath.split("\\").at(-1).slice(0, -4))
    //     // ipcRenderer.removeAllListeners('renameFileResultError')
    //     ipcRenderer.removeAllListeners('shortcutS')
    //     // ipcRenderer.on('renameFileResultError', (event, content) => {
    //     //     setFileName(directories.selectFilePath.split("\\").at(-1).slice(0, -4))
    //     //     message.error('Файл уже существует!');
    //     // })
    //     ipcRenderer.on('shortcutS', (event, content) => {
    //         message.loading({content: 'Статья сохраняется на сервер...', key: "saveNote"});
    //         handleSave().then(() => {
    //             message.success({content: 'Статья успешно сохранена!', key: "saveNote"});
    //         })
    //     })
    // }, [])

    const handleReady = () => {
        console.log("handleReady")
        const editor = editorCore.current._editorJS;
        // new Undo({ editor })
        // new DragDrop(editor);
        MermaidTool.config({'theme': 'neutral'})
    };

    const handleSave = async () => {
        try {
            const savedData = await editorCore.current.save();
            console.log(savedData)
            dispatch(updateNote({
                noteID: props.noteID,
                note: JSON.stringify(savedData)
            })).then(() => true)
        } catch (reason) {
            console.log(`Editor.js error: ${reason}`)
        }

        // try {
        //     const savedData = await editorCore.current.save();
        //
        //     let savedBlocks = savedData?.blocks
        //
        //     const changed = savedBlocks.filter(newItem => {
        //         const oldItem = blocks.find(o => o.id === newItem.id)
        //         return !_.isEqual(newItem, oldItem)
        //     })
        //
        //     const changedWithPlace = changed.map(block => {
        //         return {...block, place: savedBlocks.findIndex(x => x.id === block.id)}
        //     })
        //
        //     const deleted = blocks.filter(oldItem => {
        //         const newItem = savedBlocks.find(n => n.id === oldItem.id)
        //         return !_.isEqual(newItem, oldItem)
        //     }).filter(item => {
        //         const l = changed.find(cd => cd.id === item.id)
        //         return !l
        //     })
        //
        //     if (changed.length !== 0) {
        //         console.log("[EDITOR] Блоки до обновления: ", blocks)
        //         console.log("[EDITOR] Данные для обновления: ", savedData)
        //         console.log("[EDITOR] Блоки, которые я изменил: ", changedWithPlace)
        //     }
        //
        //     if (deleted.length !== 0) {
        //         console.log("[EDITOR] Блоки до обновления: ", blocks)
        //         console.log("[EDITOR] Данные для обновления: ", savedData)
        //         console.log("[EDITOR] Блоки, которые я удалил: ", deleted)
        //     }
        //
        //
        //     if(changed.length !== 0 || deleted.length !== 0) {
        //         blocks = [...savedData.blocks]
        //         console.log("[EDITOR] Блоки после обновления: ", blocks)
        //         dispatch(updateNote({
        //             noteID: props.noteID,
        //             note: savedData
        //         })).then(() => true)
        //     }
        // } catch (reason) {
        //     console.log(`Editor.js error: ${reason}`)
        // }
    }

    // const onChange = (e) => {
    //     setFileName(e.target.value)
    // }

    // const setterFileName = ()  => {
    //     if(fileName.trim().length !== 0) {
    //         ipcRenderer.send('renameFile', {path: directories.selectFilePath, name: directories.selectFolderPath+"\\"+fileName.trim()+".txt"});
    //         dispatch(setSelectElement(directories.selectFolderPath+"\\"+fileName.trim()+".txt"))
    //         dispatch(setSelectFilePath(directories.selectFolderPath+"\\"+fileName.trim()+".txt"))
    //         setFileName(fileName.trim())
    //     } else {
    //         setFileName(directories.selectFilePath.split("\\").at(-1).slice(0, -4))
    //         message.error('Введите название файла!');
    //     }
    //     setIsFileNameEdit(false)
    // }

    return <div className={s.editor}>
        <HotKeys keyMap={keyMap} handlers={shortcutHandlers}>
        {/*<div className={s.noteTitleContainer}>*/}
        {/*    {*/}
        {/*        isFileNameEdit ? <Space.Compact style={{ width: '100%' }} className={s.noteTitle}>*/}
        {/*            <Input placeholder="File name" onChange={onChange} value={fileName} onPressEnter={()=> setterFileName()}/>*/}
        {/*            <Button type="primary" onClick={()=> setterFileName()}>Submit</Button>*/}
        {/*        </Space.Compact> :*/}
        {/*            <Space.Compact style={{ width: '100%' }} className={s.noteTitle}>*/}
        {/*                <Input placeholder="File name" value={fileName} disabled={true}/>*/}
        {/*                <Button type="primary" onClick={()=>{*/}
        {/*                    setIsFileNameEdit(true)*/}
        {/*                }}>Edit</Button>*/}
        {/*            </Space.Compact>*/}
        {/*    }*/}
        {/*    /!*<h1 className={s.noteTitle}>{directories.selectFilePath.split("\\").at(-1).slice(0, -4)}</h1>*!/*/}
        {/*</div>*/}

        <ReactEditorJS defaultValue={props.notes}
                       tools={EDITOR_JS_TOOLS}
                       placeholder={"Нажмите + или Tab, чтобы выбрать блок"}
                       i18n={i18n}
                       autofocus={true}
                       onInitialize={handleInitialize}
                       onReady={handleReady}
            // onChange={handleSave}
                       preserveBlank={true}
            // holder="editorId"
        />

        <FloatButton.Group shape="square">
            <Tooltip placement="left" title={"Сохранить статью"} arrow={false}>
                <FloatButton icon={<SaveOutlined/>} type="default" onClick={() => {
                    message.loading({content: 'Статья сохраняется на сервер...', key: "saveNote"});
                    handleSave().then(() => {
                        message.success({content: 'Статья успешно сохранена!', key: "saveNote"});
                    })

                }}/>
            </Tooltip>
            <Tooltip placement="left" title={"Просмотр статьи"} arrow={false}>
                <FloatButton icon={<EyeOutlined/>} type="default" onClick={() => {
                    navigate("/network/note/"+props.noteID)
                }}/>
            </Tooltip>
        </FloatButton.Group>
        </HotKeys>

    </div>
}

export default EditorJS;
