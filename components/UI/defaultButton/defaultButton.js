import cn from "classnames";
import React, { useRef } from "react";
import styles from "./defaultButton.module.scss";

const DefaultButton = ({
    children,
    handleClick,
    width,
    type,
    props,
    disabled,
    spinner,
}) => {
    const btn = useRef(null);
    const hover = useRef(null);

    // btn.current.addEventListener("mouseover", () => {
    //     hover.current.style.top = "0%";
    // });
    // btn.current.addEventListener("mouseleave", () => {
    //     hover.current.style.top = "100%";
    // });

    return (
        <>
            <button
                ref={btn}
                onClick={handleClick}
                disabled={disabled}
                className={cn(styles[type])}
                style={{
                    width,
                    ...props,
                }}
            >
                <div ref={hover} className={styles.btn_hover}></div>
                <svg
                    className={styles[spinner === true && "spinner"]}
                    viewBox="0 0 50 50"
                    style={
                        spinner === true
                            ? { display: "block" }
                            : { display: "none" }
                    }
                >
                    <circle
                        className={styles.path}
                        cx="25"
                        cy="25"
                        r="20"
                        fill="none"
                        stroke-width="5"
                    ></circle>
                </svg>
                {children}
            </button>
        </>
    );
};

export default DefaultButton;
