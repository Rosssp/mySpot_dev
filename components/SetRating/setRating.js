import React, { useState } from "react";
import styles from "./setRating.module.scss";
import Image from "next/image";
import images from "../../constants/images";
import instance from "../../instanceAxios";

export default function SetRating({ id, userRating }) {
    const [hover, setHover] = useState(0);
    const [rating, setRating] = useState(0);

    const handleClick = async (value) => {
        setRating(value);
        await instance
            .post(`/api/spot/${id}/like`, { rating: value })
            .then(function (response) {
                console.log("ОЦЕНКА УСПЕШНО", response);
            })
            .then(function (error) {
                console.log(error);
            });
    };
    // api/spot/:id/like
    return (
        <ul className={styles.send_score}>
            <ul>
                {[1, 2, 3, 4, 5].map((value) => (
                    <li
                        key={value}
                        // onMouseEnter={() => setHover(value)}
                        // onMouseLeave={() => setHover(0)}
                        onClick={() => {
                            handleClick(value);
                        }}
                    >
                        <Image
                            style={{
                                opacity: value <= rating ? 1 : 0.5,
                            }}
                            src={images.star}
                        />
                    </li>
                ))}
            </ul>
        </ul>
    );
}
