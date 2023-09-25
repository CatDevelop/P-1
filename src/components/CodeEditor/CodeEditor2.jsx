import React, {useEffect, useState} from 'react';
import s from './CodeEditor.module.css'
import {ConfigProvider, Form, Input, message, Select, Tabs, theme} from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import {langs} from '@uiw/codemirror-extensions-langs';
import {vscodeDark} from '@uiw/codemirror-theme-vscode';
import {autocompletion} from '@codemirror/autocomplete';
import "./TabMenu.css"

function CodeEditor(props) {
    const TabPane = Tabs.TabPane;
    const [messageApi, contextHolder] = message.useMessage();


    // const [extensions, setExtensions] = useState();
    const [language, setLanguage] = useState("javascript")
    const [code, setCode] = useState("")
    const [selectedFile, setSelectedFile] = useState(0)
    const [filesOptions, setFilesOptions] = useState([])

    const [codeEditorForm] = Form.useForm();

    // console.log(selectedFile, filesOptions, code)


    const languages = [
        {value: "html", label: "HTML"},
        {value: "css", label: "CSS"},
        {value: "javascript", label: "JavaScript"},
        {value: "c", label: "C"},
        {value: "csharp", label: "C#"},
        {value: "cpp", label: "C++"},
        {value: "json", label: "JSON"},
        {value: "jsx", label: "React JSX"},
        {value: "php", label: "PHP"},
        {value: "python", label: "Python"},
        {value: "powershell", label: "PowerShell"},
        {value: "sql", label: "SQL"},
        {value: "typescript", label: "TypeScript"},
    ]

    useEffect(() => {
        console.log("RENDER")
        setLanguage(props.initialValues?.files[selectedFile]?.languageCode);
        setFilesOptions(props.initialValues?.files.map((file, index) => {
            return {value: index, label: file.fileName}
        }))
        setCode(props.initialValues?.files[selectedFile].code)
    }, []);

    // useEffect(() => {
    //     console.log("USE EFFECT", {data: props.getData(), selectedFile, code, language, props, filesOptions})
    //     codeEditorForm.setFieldsValue({
    //         codeEditorFileName: props.getData().files[selectedFile].fileName
    //     })
    //     setLanguage(props.getData().files[selectedFile].languageCode)
    //     setCode(props.getData().files[selectedFile].code)
    // }, [selectedFile]);

    const changeTab = (tab) => {
        console.log("1", selectedFile, tab, code, language)
        setSelectedFile(tab)
        codeEditorForm.setFieldsValue({
            codeEditorFileName: props.getData().files[tab].fileName
        })
        setLanguage(props.getData().files[tab].languageCode)
        setCode(props.getData().files[tab].code)
        console.log("2", selectedFile, tab, props.getData().files[tab].code, props.getData().files[tab].languageCode)
    }

    const add = () => {
        if (props.getData().files.length < 10) {
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
            files: props.getData().files.filter((f, i) => {
                console.log(i, targetKey, i !== targetKey);
                return i !== parseInt(targetKey)
            })
        })
        setFilesOptions(props.getData().files.map((file, index) => {
            return {value: index, label: file.fileName}
        }))
        if (parseInt(targetKey) >= selectedFile) {
            setSelectedFile(0)
            codeEditorForm.setFieldValue("codeEditorFile", 0)
        }
    }

    const onEdit = (targetKey, action) => {
        if (action === 'add') {
            add();
        } else {
            // remove(targetKey);
        }
    };

    console.log({selectedFile, code, language, props, filesOptions})
    return (
        <ConfigProvider theme={{algorithm: theme.darkAlgorithm}}>
            {contextHolder}
            <div className={s.container}>
                <Form layout="horizontal" form={codeEditorForm}>
                    <Form.Item name="codeEditorDescription"
                               label="Описание блока кода"
                               initialValue={props.initialValues?.description}
                               style={{marginBottom: "12px"}}
                    >
                        <Input onChange={e => props.onDataChange({description: e.target.value})}/>
                    </Form.Item>

                    <Tabs tabBarGutter={0}
                          tabPosition="top"
                          tabBarStyle={{margin: "0 0"}}
                          type="editable-card"
                          onEdit={onEdit}
                          onChange={e => changeTab(parseInt(e))}
                    >
                        {
                            filesOptions.map(tab => {
                                return <TabPane tab={tab.label} key={tab.value}></TabPane>
                            })
                        }
                    </Tabs>


                    <Form.Item name="codeEditorFileName"
                               label="Название файла"
                               initialValue={props.getData().files[selectedFile].fileName}
                               style={{marginBottom: "12px"}}
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
                    <Form.Item //name="codeEditorFileLanguage"
                        label="Язык программирования"
                        initialValue={props.getData()?.files[selectedFile]?.languageCode}
                        style={{marginBottom: "12px"}}
                    >
                        <Select style={{width: '100%'}}
                                options={languages}
                                value={language}
                                showSearch={true}
                                onChange={value => {
                                    setLanguage(value)
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
                        extensions={[autocompletion(), langs[language]()]}
                        onChange={e => {
                            props.onDataChange({
                                files: props.getData().files.with(selectedFile, {
                                    ...props.getData().files[selectedFile],
                                    code: e
                                })

                            });
                            setCode(e);
                        }}
                    />

                    {/*<MyCodeMirror code={code}*/}
                    {/*              language={language}*/}
                    {/*              onChange={e => {*/}
                    {/*                  props.onDataChange({*/}
                    {/*                      files: props.getData().files.with(selectedFile, {*/}
                    {/*                          ...props.getData().files[selectedFile],*/}
                    {/*                          code: e*/}
                    {/*                      })*/}
                    {/*                  })*/}
                    {/*                  setCode(e)*/}
                    {/*              }}*/}
                    {/*/>*/}
                </Form>
            </div>
        </ConfigProvider>
    )
}

export default CodeEditor;
