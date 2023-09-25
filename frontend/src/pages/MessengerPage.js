import s from "./Pages.module.css";
import FirstMenu from "../components/Menu/Menu";
import React from "react";

export const MessengerPage = () => {
    return (
        <div>
            <div className={s.mainContainer}>
                <FirstMenu selectedKeys={["Messenger"]}/>
                Messenger
            </div>
        </div>
    )
}
