import styles from "./sendComment.module.scss";
import React, { useState } from "react";
import instance from "../../instanceAxios";
import { toast } from "react-toastify";
import Loader from "../UI/Loader/loader";

export default function SendComment({ id }) {
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const handeSendMessage = async () => {
        setIsLoading(true);
        await instance
            .post(`/api/spot/${id}/post_comment`, { content })
            .then(function (response) {
                setIsLoading(false);
                console.log(response);
                setContent("");
            })
            .catch(function (error) {
                setIsLoading(false);
                console.log(error);
                if (error?.response?.data && !error?.response?.data?.errors) {
                    toast.error(`Вы уже оствили комментарий`);
                }
            });
    };
    return (
        <div className={styles.write_message}>
            <input
                style={{ opacity: isLoading ? 0.4 : 1, paddingLeft: "12px" }}
                name="text"
                type="text"
                placeholder="Комментарий"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                        handeSendMessage();
                    }
                }}
            />
            <button
                onClick={() => {
                    handeSendMessage();
                }}
            >
                {isLoading ? <Loader spinner={isLoading} /> : <p>{">"}</p>}
            </button>
        </div>
    );
}
