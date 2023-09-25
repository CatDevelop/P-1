import React, {useEffect, useState} from 'react';
import {vscodeDark} from "@uiw/codemirror-theme-vscode";
import {autocompletion} from "@codemirror/autocomplete";
import {langs} from "@uiw/codemirror-extensions-langs";
import CodeMirror from "@uiw/react-codemirror";
export default function MyCodeMirror(props){
    console.log("MyCodeMirror", props)
    return (
        <>
            <CodeMirror
                value={props.code}
                height="600px"
                theme={vscodeDark}
                placeholder="Введите ваш код"
                basicSetup={{ history: true, lineNumbers: true, closeBrackets: true, tabSize: 4 }}
                extensions={[autocompletion(), langs[props.language]()]}
                onChange={props.onChange}
            />
        </>

    )
}
