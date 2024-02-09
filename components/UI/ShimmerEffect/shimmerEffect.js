import React from "react";
import { Shimmer } from "react-shimmer";
import styles from "./shimmerEffect.module.scss";

export default function ShimmerEffect({ height }) {
    return (
        // <div className={styles.wrapper}>
        <Shimmer className={styles.wrapper} height={height} duration={500}>
            <div style={{ width: "100%", height: "100%" }}></div>
        </Shimmer>
    );
}
