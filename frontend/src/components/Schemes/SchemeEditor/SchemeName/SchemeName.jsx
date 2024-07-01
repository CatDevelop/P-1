import React, {useCallback} from "react"
import styles from "./SchemeName.module.css"
import classNames from "classnames";

export const SchemeName = (props) => {
    return (
        <div className={styles.schemeName}>
            <p className={classNames(styles.schemeName__title, !props.title && styles.schemeName__title_undefined)}>
                {props.title || "Без названия"}
            </p>
            <p className={styles.schemeName__lastChange}>
                Последнее изменение: 18:28 15 октября 2023
            </p>
        </div>
    )
}
