import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './variables.css';
import MyApp from './App';
import {App, ConfigProvider, theme} from "antd";
import {Provider} from "react-redux";
import store from "./store";
import {useTheme} from "./hooks/use-theme";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
        <Container/>
    </Provider>
);
document.body.classList.toggle('darkTheme');


function Container() {
    const myTheme = useTheme()

    return (
        <ConfigProvider theme={{algorithm: theme.darkAlgorithm}}>
            <App className={myTheme.theme === 'dark' ? "darkTheme" : ""}>
                <MyApp/>
            </App>
        </ConfigProvider>
    )
}
