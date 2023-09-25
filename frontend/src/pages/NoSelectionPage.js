import SideBar from "../components/Side/SideBar/SideBar"
import s from './Pages.module.css'
import FirstMenu from "../components/Menu/Menu";
import React from "react";

export const NoSelectionPage = (props) => {
    return (
        <div className={s.welcomePage}>
            <div className={s.mainContainer}>
                <FirstMenu selectedKeys={["home"]}/>
                {/*<SideBar checked={true}/>*/}
                <p>Выберите файл слева</p>
            </div>
        </div>
    )
}
