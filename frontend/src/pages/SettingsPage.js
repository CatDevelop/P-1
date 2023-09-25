import s from "./Pages.module.css";
import FirstMenu from "../components/Menu/Menu";
import React from "react";

export const SettingsPage = () => {
    return (
        <div>
            <div className={s.mainContainer}>
                <FirstMenu selectedKeys={["Settings"]}/>
                Settings
            </div>
        </div>
    )
}
