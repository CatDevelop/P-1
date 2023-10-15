import React, {useCallback} from "react"
import styles from "./SchemeName.module.css"
import classNames from "classnames";
import s from "../../../TimeTrackingRow/TimeTrackingRow.module.css";
import {Typography} from "antd";
import clsx from "clsx";
export const SchemeName = (props) => {
    const handleChangeName = useCallback(() => {

    }, [])

    return (
        <div className={styles.schemeName}>
            <p className={clsx(styles.schemeName__title, !props.title && styles.schemeName__title_undefined)}>
                {props.title || "Без названия"}
            </p>
            <p className={styles.schemeName__lastChange}>
                Последнее изменение: 18:28 15 октября 2023
            </p>
        </div>
    )
}
