import s from "./Pages.module.css";
import FirstMenu from "../components/Menu/Menu";
import React from "react";
import {Button} from "antd";
import {useDispatch} from "react-redux";
import {removeUser} from "../store/slices/userSlice";

export const SettingsPage = () => {
    const dispatch = useDispatch();
    return (
        <div>
            <div className={s.mainContainer}>
                <FirstMenu selectedKeys={["Settings"]}/>
                <Button onClick={() => dispatch(removeUser())}>Выйти из аккаунта</Button>
            </div>
        </div>
    )
}
