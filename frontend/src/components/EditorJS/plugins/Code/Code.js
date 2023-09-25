import {default as React} from 'react';
import ReactDOM from 'react-dom';
import store from "../../../../store";
import {Provider} from "react-redux";
import CodeEditor from "../../../CodeEditor/CodeEditor2";

export default class MyCodeEditor {
    static get toolbox() {
        return {
            title: 'Code',
            icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 9L11 12L8 15M13 15H16M5 20H19C20.1046 20 21 19.1046 21 18V6C21 4.89543 20.1046 4 19 4H5C3.89543 4 3 4.89543 3 6V18C3 19.1046 3.89543 20 5 20Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        };
    }

    static get isReadOnlySupported() {
        return true;
    }

    constructor({data, config, api, readOnly}) {
        this.api = api;
        this.readOnly = readOnly;

        this.data = {
            files: data.files || [{
                id: 0,
                fileName: "index.js",
                languageCode: "javascript",
                code: ""
            }],
            description: data.description || '',
            // schemeID: data.schemeID || '',

            // isStatic: data.isStatic !== undefined ? data.isStatic : false
        };

        this.CSS = {
            wrapper: 'ce-block__code',
        };

        this.nodes = {
            holder: null,
        };


        this.wrapper = undefined;
    }



    render() {
        const rootNode = document.createElement('div');
        rootNode.setAttribute('class', this.CSS.wrapper);
        this.nodes.holder = rootNode;

        rootNode.addEventListener('keydown', this.keyDownListener);
        rootNode.addEventListener('paste', (event) => {event.stopPropagation();});

        const onDataChange = (newData) => {
            this.data = {
                ...this.data,
                ...newData
            };
            console.log(this.data, newData)
        }

        // const changeFile = (index, file) => {
        //     this.data.files = this.data.files.with(index, file);
        //     // console.log(this.data, newData)
        // }

        const getData = () => {
            return this.data
        }

        ReactDOM.render(
            (
                <Provider store={store}>
                    <CodeEditor onDataChange={onDataChange} initialValues={this.data} getData={getData}/>
                </Provider>
            ),
            rootNode);

        return this.nodes.holder;
    }

    save() {
        return {
            files: this.data.files,
            description: this.data.description
        }
    }

    destroy() {
        this.nodes.holder.removeEventListener('keydown', this.keyDownListener)
        this.nodes.holder.removeEventListener('paste', (event) => {event.stopPropagation();})
    }

    keyDownListener(event) {
        switch (event.code) {
            case 'Tab':
                event.stopPropagation();
                event.preventDefault();
                break;
            case 'Enter':
                event.stopPropagation();
                event.preventDefault();
                break;
        }
    }
}
