import styles from "./loader.module.scss";

export default function Loader({ spinner }) {
    return (
        <svg
            className={styles[spinner === true && "spinner"]}
            viewBox="0 0 50 50"
            style={
                spinner === true ? { display: "block" } : { display: "none" }
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
    );
}
