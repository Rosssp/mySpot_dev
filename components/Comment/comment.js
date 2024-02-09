import React, { useEffect, useState } from "react";
import styles from "./comment.module.scss";
import Image from "next/image";
import useFormattedDate from "../../Hooks/useFormattedDate";
import images from "../../constants/images";
import RatingsLayout from "../../layout/RatingsLayout/ratingsLayout";
import cn from "classnames";

export default function Comment({ comments, userRatings }) {
    const [currentComments, setCurrentComments] = useState(5);

    const handleShowMoreComments = (e) => {
        e.preventDefault();
        setCurrentComments((prev) => prev + 5);
    };
    console.log("userRatings", userRatings);
    console.log("comments", comments);

    // const getRatingByUserId = (userId) =>
    //     userRatings?.find((rating) => rating?.user_id === userId)?.rating;

    const [popOverUser, setPopOverUser] = useState(false);
    const [selectedComment, setSelectedComment] = useState();
    const handleCommentClick = (comment) => {
        setPopOverUser(true);
        setSelectedComment(comment);
    };
    console.log("selectedCommentselectedComment", selectedComment);

    return (
        <>
            <div className={styles.comments}>
                {/* {isLoading && <ShimmerEffect height={80} />} */}
                {comments?.slice(0, currentComments)?.map((item) => (
                    <>
                        <div
                            key={item?.id}
                            className={cn(
                                styles.comments__item,
                                styles[popOverUser && "popOverOpen"]
                            )}
                        >
                            <div
                                className={styles.user}
                                onClick={() => handleCommentClick(item)}
                            >
                                {item?.avatar?.url && (
                                    <div className={styles.user__image}>
                                        <Image
                                            src={item?.avatar?.url}
                                            alt={
                                                item?.nickname && item?.nickname
                                            }
                                            fill="cover"
                                            // placeholder="empty"
                                        />
                                    </div>
                                )}
                                <p>
                                    &nbsp;
                                    {item?.nickname === ""
                                        ? `User ${item?.user_id}`
                                        : item?.nickname}
                                </p>
                                {(() => {
                                    const num = item?.rating;
                                    if (num) {
                                        const ratingArr = [];
                                        for (let i = 1; i <= num; i++) {
                                            ratingArr.push(
                                                <Image
                                                    key={i}
                                                    className={"svg"}
                                                    width={20}
                                                    src={images.star}
                                                />
                                            );
                                        }
                                        return ratingArr;
                                    }
                                })()}
                                <p>&nbsp;•&nbsp;</p>
                                <p className={styles.date}>
                                    {useFormattedDate(item?.created_at)}
                                </p>
                            </div>
                            <p className={styles.message}>{item?.content}</p>
                            <hr style={{ opacity: "0.4" }} />
                        </div>
                    </>
                ))}
                {popOverUser && (
                    <div className={styles.userPopOver}>
                        <RatingsLayout
                            baloon={true}
                            name={
                                !selectedComment?.nickname
                                    ? `User ${selectedComment?.user_id}`
                                    : selectedComment?.nickname
                            }
                            avatar={selectedComment?.avatar?.url}
                            score={selectedComment?.score}
                            closeFn={() => setPopOverUser(false)}
                            socialItems={[
                                selectedComment?.tg,
                                selectedComment?.vk,
                            ]}
                        />
                    </div>
                )}
                {currentComments < comments?.length && (
                    <p
                        className={styles.showMore}
                        onClick={handleShowMoreComments}
                    >
                        ПОКАЗАТЬ ЕЩЁ...
                    </p>
                )}
            </div>
        </>
    );
}
