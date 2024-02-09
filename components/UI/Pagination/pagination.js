import React from "react";
import styles from "./pagination.module.scss";
import Image from "next/image";

export default function Pagination() {
    return (
        <div className={styles.wrapper}>
            <div>
                <Image />
                1 2
                <Image />
            </div>
        </div>
    );
}
