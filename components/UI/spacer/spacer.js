import React from "react";
import styles from "./spacer.module.scss";
import useMediaQuery from "../../../Hooks/useMediaQuery";

const Spacer = ({ size }) => {
    const mob580 = useMediaQuery(580);
    return (
        <>
            <div className={styles[size]} />
        </>
    );
};

export default Spacer;
