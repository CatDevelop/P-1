import {default as React} from 'react';
import ReactDOM from 'react-dom';
import SelectScheme from "../../../SelectScheme/SelectScheme";
import store from "../../../../store";
import {Provider} from "react-redux";
import { IconAddBorder } from '@codexteam/icons';

export default class Scheme {
    static get toolbox() {
        return {
            title: 'Scheme',
            icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.6581 8.68387C11.0619 8.88615 11.5176 9 12 9C12.4824 9 12.9381 8.88615 13.3419 8.68387M10.6581 8.68387C9.67492 8.19133 9 7.17448 9 6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6C15 7.17449 14.3251 8.19134 13.3419 8.68387M10.6581 8.68387L7.34193 15.3161M13.3419 8.68387L16.6581 15.3161M16.6581 15.3161C15.6749 15.8087 15 16.8255 15 18C15 19.6569 16.3431 21 18 21C19.6569 21 21 19.6569 21 18C21 16.3431 19.6569 15 18 15C17.5176 15 17.0619 15.1138 16.6581 15.3161ZM7.34193 15.3161C6.93815 15.1138 6.48237 15 6 15C4.34315 15 3 16.3431 3 18C3 19.6569 4.34314 21 6 21C7.65685 21 9 19.6569 9 18C9 16.8255 8.32508 15.8087 7.34193 15.3161Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        };
    }

    static get isReadOnlySupported() {
        return true;
    }

    constructor({data, config, api, readOnly}) {
        this.api = api;
        this.readOnly = readOnly;

        this.data = {
            schemeID: data.schemeID || '',
            description: data.description || '',
            isStatic: data.isStatic !== undefined ? data.isStatic : false
        };

        this.CSS = {
            wrapper: 'ce-block__scheme',
        };

        this.nodes = {
            holder: null,
        };


        this.wrapper = undefined;
        this.settings = [
            {
                icon: IconAddBorder,
                label: 'Статическое отображение',
                onActivate: () => {
                    this._toggleTune('isStatic');
                },
                toggle: true,
                isActive: this.data.isStatic
            }
        ];
    }

    render() {
        const rootNode = document.createElement('div');
        rootNode.setAttribute('class', this.CSS.wrapper);
        this.nodes.holder = rootNode;

        const onDataChange = (newData) => {
            console.log(this.data, newData)
            this.data = {
                ...this.data,
                ...newData
            };
        }

        ReactDOM.render(
            (
                <Provider store={store}>
                    <SelectScheme onDataChange={onDataChange} initialValues={this.data}/>
                </Provider>
            ),
            rootNode);

        return this.nodes.holder;
    }

    save() {
        return {
            schemeID: this.data.schemeID,
            description: this.data.description,
            isStatic: this.data.isStatic,
        }
    }


    renderSettings(){
        return [
            {
                icon: IconAddBorder,
                label: 'Статическое отображение',
                onActivate: () => {
                    this._toggleTune('isStatic');
                },
                toggle: true,
                isActive: this.data.isStatic

            }
        ]
    }

    _toggleTune(tune) {
        this.data[tune] = !this.data[tune];
    }
}
