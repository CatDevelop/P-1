import s from "./Pages.module.css";
import FirstMenu from "../components/Menu/Menu";
import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {removeSchemes} from "../store/slices/schemesSlice";
import {removeTasks} from "../store/slices/tasksSlice";

export const SchedulePage = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(removeSchemes())
        dispatch(removeTasks())
    }, [])
    return (
        <div>
            <div className={s.mainContainer}>
                <FirstMenu selectedKeys={["Schedule"]}/>
                Schedule
            </div>
        </div>
    )
}
