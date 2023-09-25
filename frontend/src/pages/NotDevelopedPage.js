import s from "./Pages.module.css";
import {Button, Result} from "antd";
import {useNavigate} from "react-router-dom";
import FirstMenu from "../components/Menu/Menu";
import React from "react";

export const NotDevelopedPage = (props) => {

    const navigate = useNavigate()
    return (
        <div>
            <FirstMenu selectedKeys={[props.selectedKey]}/>
            <div className={s.errorPage}>
                <Result
                    status="404"
                    title="В разработке"
                    subTitle="Извините, данный раздел находиться в разработке!"
                    extra={<Button type="primary" onClick={() => navigate("/") }>На главную</Button>}
                />
            </div>
        </div>
    )
}
