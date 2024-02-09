import cn from "classnames";
import React from "react";
import styles from "./input.module.scss";

export default function Input({ errors, ...props }) {
    return (
        <div className={styles.input__wrapper}>
            <input {...props} className={cn(styles.input, styles[errors])} />
        </div>
    );
}
