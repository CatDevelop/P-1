import s from "./Pages.module.css";
import {Button, Result} from "antd";
import {useNavigate} from "react-router-dom";
import FirstMenu from "../components/Menu/Menu";
import React from "react";

export const NotFoundPage = () => {

    const navigate = useNavigate()
    return (
        <div>
            <FirstMenu/>
            <div className={s.errorPage}>
                <Result
                    status="404"
                    title="404"
                    subTitle="Извините, страница не существует"
                    extra={<Button type="primary" onClick={() => navigate("/") }>На главную</Button>}
                />
            </div>
        </div>
    )
}
