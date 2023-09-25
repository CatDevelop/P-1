import s from "./Pages.module.css";
import FirstMenu from "../components/Menu/Menu";
import React from "react";

export const BugsPage = () => {
    return (
        <div>
            <div className={s.mainContainer}>
                <FirstMenu selectedKeys={["Bugs"]}/>
                Bugs
            </div>
        </div>
    )
}
