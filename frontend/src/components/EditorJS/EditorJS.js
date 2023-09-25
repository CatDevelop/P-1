import {createReactEditorJS} from 'react-editor-js'
import React, {useCallback, useEffect} from "react";
import s from "./EditorJS.module.css"
import MermaidTool from 'editorjs-mermaid'
import {EyeOutlined, SaveOutlined} from "@ant-design/icons";
import {App, FloatButton, Tooltip} from "antd";
import {useDispatch} from "react-redux";
import {EDITOR_JS_TOOLS, i18n} from "./config";
import {updateNote} from "../../store/slices/noteSlice";
import {useNavigate} from "react-router-dom";


function EditorJS(props) {
    const {message} = App.useApp();
    const dispatch = useDispatch()
    const navigate = useNavigate()
    let ReactEditorJS = createReactEditorJS();
    const editorCore = React.useRef(null);
    console.log("PROPS", props.notes)

    const handleInitialize = (instance) => {
        console.log("handleInitialize")
        editorCore.current = instance
    }

    const handleKeyDown = (e) => {
        console.log(e)
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            message.loading({content: 'Статья сохраняется на сервер...', key: "saveNote"});
            handleSave().then(() => {
                message.success({content: 'Статья успешно сохранена!', key: "saveNote"});
            })
            return false;
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [])

    const handleReady = () => {
        console.log("handleReady")
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
        return false;
    }


    return <div className={s.editor}>
        <ReactEditorJS defaultValue={props.notes}
                       tools={EDITOR_JS_TOOLS}
                       placeholder={"Нажмите + или Tab, чтобы выбрать блок"}
                       i18n={i18n}
                       autofocus={true}
                       onInitialize={handleInitialize}
                       onReady={handleReady}
                       preserveBlank={true}
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
                    navigate("/note/"+props.noteID)
                }}/>
            </Tooltip>
        </FloatButton.Group>
    </div>
}

export default EditorJS;
