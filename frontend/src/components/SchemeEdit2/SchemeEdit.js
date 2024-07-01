import React, {useEffect, useState} from 'react';
import {ThemeProvider} from 'styled-components';
import {darkTheme} from './theme';
import s from './SchemeEdit.module.css'
import 'reactflow/dist/style.css';
import {App, Button} from "antd";
import {useDispatch} from "react-redux";
import {DefaultMainMenu, loadSnapshot, Tldraw, TldrawUiMenuGroup, TldrawUiMenuItem, useEditor} from "tldraw";
import {getScheme, updateScheme} from "../../store/slices/schemeSlice";

function CustomMainMenu(handleSave) {
    const editor = useEditor()

    return (
        <DefaultMainMenu>
            <div>
                <TldrawUiMenuGroup id="example">
                    <TldrawUiMenuItem
                        id="save"
                        label="Cохранить"
                        onSelect={() => {
                            handleSave(editor.getSnapshot())
                        }}
                    />
                </TldrawUiMenuGroup>
            </div>
        </DefaultMainMenu>
    )
}

const EditorController = (props) => {
    // const editor = useEditor()
    //
    // console.log("PROPS", props)
    //
    // useEffect(() => {
    //     editor.loadSnapshot(props.scheme)
    // }, []);
    // return ;
}

const Flow = ({children, props}) => {
    const dispatch = useDispatch()
    const {message} = App.useApp();

    const [snapshot, setSnapshot] = useState(null)

    useEffect(() => {
        async function load() {
            setSnapshot(props.scheme)
        }

        load()
    }, [])


    const handleSave = (data) => {
        message.loading({content: 'Схема сохраняется на сервер...', key: "saveScheme"});
        dispatch(updateScheme({scheme: JSON.stringify(data), schemeID: props.schemeID}))
            .then(() => {
                message.success({content: 'Схема успешно сохранена!', key: "saveScheme"});
                dispatch(getScheme(props.schemeID))
            }, () => {
                message.error({content: 'Ошибка обновления схемы!', key: "saveScheme"});
            })
    }
    //
    // const handleKeyDown = (e) => {
    //     console.log(e)
    //     if (e.ctrlKey && e.key === 's') {
    //         e.preventDefault();
    //         handleSave(nodes, edges)
    //         return false;
    //     }
    // }
    //
    // useEffect(() => {
    //     document.addEventListener('keydown', handleKeyDown);
    //     return () => document.removeEventListener('keydown', handleKeyDown);
    // }, [nodes, edges])


    return (
        <Tldraw
            inferDarkMode
            components={{
                HelpMenu: null,
                PageMenu: null,
                HelperButtons: null,
                DebugPanel: null,
                DebugMenu: null,
                SharePanel: null,
                MenuPanel: () => CustomMainMenu(handleSave),
            }}
            snapshot={snapshot}
        >
            <EditorController handleSave={handleSave} sheme={props.scheme}/>
        </Tldraw>
    );
};

export default (props) => {
    return (
        <ThemeProvider theme={darkTheme}>
            <div className={s.previewContainer}>
                <Flow props={props}/>
                <Button>Сохранить</Button>
            </div>
        </ThemeProvider>
    );
};
