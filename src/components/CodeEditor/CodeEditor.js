import React, {useEffect, useState} from 'react';
import s from './CodeEditor.module.css'
import {ConfigProvider, message, Form, Input, Segmented, Select, Space, theme, Button, Tabs} from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import {langs} from '@uiw/codemirror-extensions-langs';
import {vscodeDark} from '@uiw/codemirror-theme-vscode';
import {autocompletion} from '@codemirror/autocomplete';

import "./TabMenu.css"
function CodeEditor(props) {
    const TabPane = Tabs.TabPane;
    const [messageApi, contextHolder] = message.useMessage();
    const [extensions, setExtensions] = useState();
    const [code, setCode] = useState("")
    const [selectedFile, setSelectedFile] = useState(0)
    const [filesOptions, setFilesOptions] = useState([])

    const [codeEditorForm] = Form.useForm();

    console.log(selectedFile, filesOptions, code)


    const languages = [
        {value: "html", label: "HTML"},
        {value: "css", label: "CSS"},
        {value: "javascript", label: "JavaScript"},
        // {value: "aspnet", label: "ASP.NET (C#)"},
        // {value: "bbcode", label: "BBcode"},
        {value: "c", label: "C"},
        {value: "csharp", label: "C#"},
        {value: "cpp", label: "C++"},
        // {value: "git", label: "Git"},
        {value: "json", label: "JSON"},
        {value: "jsx", label: "React JSX"},
        {value: "php", label: "PHP"},
        {value: "python", label: "Python"},
        {value: "powershell", label: "PowerShell"},
        {value: "sql", label: "SQL"},
        {value: "typescript", label: "TypeScript"},
    ]

    function handleLangChange(lang) {
        setExtensions([autocompletion(), langs[lang]()]);
    }

    useEffect(() => {
        if(selectedFile > filesOptions.length)
            return ;

        handleLangChange(props.initialValues?.files[selectedFile]?.languageCode);
        setFilesOptions(props.initialValues?.files.map((file, index) => {
            return {value: index, label: file.fileName}
        }))
        setCode(props.initialValues?.files[selectedFile].code)
    }, []);

    useEffect(() => {
        if(selectedFile > filesOptions.length)
            return ;

        codeEditorForm.setFieldsValue({
            codeEditorFileName: props.getData().files[selectedFile].fileName,
            codeEditorFileLanguage: props.getData().files[selectedFile]?.languageCode
        })
        console.log("USE EFFECT", selectedFile, props.getData().files[selectedFile].code)
        // setCode(props.getData().files[selectedFile].code)
    }, [selectedFile]);

    const add = () => {
        if(props.getData().files.length < 10) {
            props.onDataChange({
                files: [...props.getData().files, {
                    fileName: "index.js",
                    languageCode: "javascript",
                    code: ""
                }]
            })
            setFilesOptions(props.getData().files.map((file, index) => {
                return {value: index, label: file.fileName}
            }))
        } else {
            messageApi.open({type: "error", content: "Не больше 10 файлов в одном блоке"})
        }
    }

    const remove = (targetKey) => {

        props.onDataChange({
            files: props.getData().files.filter((f, i) => {console.log(i, targetKey, i !== targetKey); return i !== parseInt(targetKey)})
        })
        setFilesOptions(props.getData().files.map((file, index) => {
            return {value: index, label: file.fileName}
        }))
        if(parseInt(targetKey) >= selectedFile) {
            setSelectedFile(0)
            codeEditorForm.setFieldValue("codeEditorFile", 0)
        }
    }

    const onEdit = (targetKey, action) => {
        if (action === 'add') {
            add();
        } else {
            remove(targetKey);
        }
    };


    return (
        <ConfigProvider theme={{algorithm: theme.darkAlgorithm}}>
            {contextHolder}
            <div className={s.container}>
                <Form layout="horizontal" hideRequiredMark form={codeEditorForm}>
                    <Form.Item
                        name="codeEditorDescription"
                        label="Описание блока кода"
                        initialValue={props.initialValues?.description}
                        style={{marginBottom: "12px"}}
                    >
                        <Input onChange={e => props.onDataChange({description: e.target.value})}/>
                    </Form.Item>
                    {/*<Space direction={"horizontal"} align={"center"}>*/}
                        <Form.Item
                            name="codeEditorFile"
                            style={{marginBottom: "12px"}}
                            initialValue={0}
                        >
                            {/*<Tabs tabBarGutter={5} tabPosition={"top"} tabBarStyle={{margin: "15px 0"}}  type="line" items={filesOptions} onChange={e => {*/}
                            {/*    setSelectedFile(e)*/}
                            {/*    codeEditorForm.setFieldValue("codeEditorFile", e)*/}
                            {/*    console.log("123", props.getData(), e)*/}
                            {/*    setCode(props.getData().files[e].code)*/}
                            {/*}} />*/}
                            <Tabs tabBarGutter={0}
                                  tabPosition={"top"}
                                  tabBarStyle={{margin: "0 0"}}
                                  type="editable-card"
                                  onEdit={onEdit}
                                  onChange={e => {
                                      setSelectedFile(e)
                                      codeEditorForm.setFieldValue("codeEditorFile", e)
                                      console.log("123", props.getData(), e)
                                      setCode(props.getData().files[e].code)
                                  }} >
                                {
                                    filesOptions.map(tab => {
                                        return <TabPane tab={ tab.label } key={tab.value}></TabPane>
                                    })
                                }
                            </Tabs>
                            {/*<Segmented style={{display: "flex", flexWrap: "wrap"}} defaultValue={0} options={filesOptions} value={selectedFile} onChange={(e) => {*/}
                            {/*    setSelectedFile(e)*/}
                            {/*    codeEditorForm.setFieldValue("codeEditorFile", e)*/}
                            {/*    console.log("123", props.getData(), e)*/}
                            {/*    setCode(props.getData().files[e].code)*/}
                            {/*    // console.log(e, codeEditorValues)*/}
                            {/*}}/>*/}
                        </Form.Item>

                    {/*    {*/}
                    {/*        props.getData().files.length < 10 ?*/}
                    {/*            <div className={s.plusIcon} onClick={() => {*/}
                    {/*            if(props.getData().files.length < 10) {*/}
                    {/*                props.onDataChange({*/}
                    {/*                    files: [...props.getData().files, {*/}
                    {/*                        fileName: "index.js",*/}
                    {/*                        languageCode: "javascript",*/}
                    {/*                        code: ""*/}
                    {/*                    }]*/}
                    {/*                })*/}
                    {/*                setFilesOptions(props.getData().files.map((file, index) => {*/}
                    {/*                    return {value: index, label: file.fileName}*/}
                    {/*                }))*/}
                    {/*            } else {*/}
                    {/*                messageApi.open({type: "error", content: "Не больше 10 файлов в одном блоке"})*/}
                    {/*            }*/}

                    {/*        }}>*/}
                    {/*            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                    {/*                <path d="M12 4V20M20 12L4 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>*/}
                    {/*            </svg>*/}
                    {/*        </div> : <></>*/}
                    {/*    }*/}

                        {/*{*/}
                        {/*    props.getData().files.length > 1 ?*/}
                        {/*        <div className={s.plusIcon} onClick={() => {*/}
                        {/*            props.onDataChange({*/}
                        {/*                files: props.getData().files.filter((f, i) => i !== selectedFile)*/}
                        {/*            })*/}
                        {/*            setFilesOptions(props.getData().files.map((file, index) => {*/}
                        {/*                return {value: index, label: file.fileName}*/}
                        {/*            }))*/}
                        {/*            if(selectedFile >= props.getData().files.length) {*/}
                        {/*                setSelectedFile(props.getData().files.length-1)*/}
                        {/*                codeEditorForm.setFieldValue("codeEditorFile", props.getData().files.length-1)*/}
                        {/*            }*/}
                        {/*            // setSelectedFile(0)*/}
                        {/*            // codeEditorForm.setFieldValue("codeEditorFile", 0)*/}
                        {/*    }}>*/}
                        {/*        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                        {/*            <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>*/}
                        {/*        </svg>*/}
                        {/*    </div> : <></>*/}
                        {/*}*/}


                    {/*</Space>*/}
                    <Form.Item
                        name="codeEditorFileName"
                        label="Название файла"
                        initialValue={props.getData().files[selectedFile].fileName}
                        style={{marginBottom: "12px"}}
                        // rules={[{required: true, message: 'Введите название статьи'}]}
                        // initialValue={editNote?.title}
                    >
                        <Input onChange={e => {
                            props.onDataChange({
                                files: props.getData().files.with(selectedFile,
                                    {
                                        ...props.getData().files[selectedFile],
                                        fileName: e.target.value
                                    })
                            })
                            setFilesOptions(filesOptions.with(selectedFile, {
                                ...filesOptions[selectedFile],
                                label: e.target.value
                            }))
                        }}/>
                    </Form.Item>
                    <Form.Item
                        name="codeEditorFileLanguage"
                        label="Язык программирования"
                        initialValue={props.getData()?.files[selectedFile]?.languageCode}
                        style={{marginBottom: "12px"}}
                        // initialValue={editNote ? JSON.parse(editNote.tags).map(tag => ({value: tag, label: tag})) : []}
                        // rules={[{ required: true, message: 'Please select an owner' }]}
                    >
                        <Select
                            // mode="tags"
                            style={{
                                width: '100%',
                            }}
                            options={languages}
                            showSearch={true}
                            onChange={value => {
                                handleLangChange(value)
                                props.onDataChange({
                                    files: props.getData().files.with(selectedFile, {
                                        ...props.getData().files[selectedFile],
                                        languageCode: value
                                    })
                                })
                                // props.onDataChange({schemeID: value})}
                            }}
                        />
                    </Form.Item>
                    <CodeMirror
                        value={code}
                        height="600px"
                        theme={vscodeDark}
                        placeholder="Введите ваш код"
                        basicSetup={{history: true, lineNumbers: true, closeBrackets: true, tabSize: 4}}
                        extensions={extensions}
                        // extensions={[javascript({ jsx: true })]}
                        // onChange={onChange}
                        onChange={e => props.onDataChange({
                            files: props.getData().files.with(selectedFile, {
                                ...props.getData().files[selectedFile],
                                code: e
                            })
                        })}
                    />
                </Form>
            </div>
        </ConfigProvider>
    )
}

export default CodeEditor;
