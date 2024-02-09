import styles from "./markPopup.module.scss";
import React, { useEffect, useState } from "react";
import cn from "classnames";
import Image from "next/image";
import { getCookie } from "cookies-next";
import DefaultButton from "../UI/defaultButton/defaultButton";
import { useRouter } from "next/router";
import ShimmerEffect from "../UI/ShimmerEffect/shimmerEffect";
import SendComment from "../SendComment/sendComment";
import Slider from "../Slider/slider";
import Comment from "../Comment/comment";
import axios from "axios";
import images from "../../constants/images";
import SetRating from "../SetRating/setRating";
import RatingsLayout from "../../layout/RatingsLayout/ratingsLayout";
import instance from "../../instanceAxios";

export default function MarkPopup({ id, title, score }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [cookieState, setCookieState] = useState(false);
    console.log("selectedSpot", selectedSpot);

    const handleSpotClick = async (id) => {
        const cookie = getCookie("myspot_jwt2222");
        cookie?.length === 0 || cookie === undefined
            ? setCookieState(false)
            : setCookieState(true);
        const response = await instance.get(
            process.env.NEXT_PUBLIC_API + `/api/spot/${id}.json`
        );
        setSelectedSpot(response.data);
        setIsLoading(false);
    };
    const [popupOpen, setPopupOpen] = useState(false);
    const [figure, setFigure] = useState([
        { name: "pool", value: "" },
        { name: "ramp", value: "" },
        { name: "rail", value: "" },
        { name: "ladder", value: "" },
        { name: "slide_elements", value: "" },
    ]);
    useEffect(() => {
        setFigure([
            { name: "pool", value: selectedSpot?.pools },
            { name: "ramp", value: selectedSpot?.ramps },
            { name: "rail", value: selectedSpot?.rail },
            { name: "ladder", value: selectedSpot?.ladder },
            { name: "slide_elements", value: selectedSpot?.slide },
        ]);
    }, [selectedSpot]);

    console.log("figurefigurefigure", figure);

    return (
        <div
            id={id}
            className={styles.spot}
            onClick={() => {
                setPopupOpen(true);
                handleSpotClick(id);
            }}
        >
            {!popupOpen && (
                <>
                    <h1 className={styles.spot__mark}>{title}</h1>
                </>
            )}
            <div className={styles.spot__aside}>
                {popupOpen && (
                    <p
                        className={styles.spot__close}
                        onClick={(e) => {
                            e.stopPropagation();
                            setPopupOpen(false);
                        }}
                    >
                        ✕
                    </p>
                )}
                <p className={styles.spot__score}>
                    {score?.toString()?.replace(".", " . ")}
                </p>
                {popupOpen && <SetRating id={id} />}
            </div>
            {popupOpen && (
                <div className={styles.spot__open}>
                    <div className={styles.image}>
                        <Slider
                            isLoading={isLoading}
                            spot={true}
                            images={selectedSpot?.images}
                            perView={1}
                            id={id}
                        />
                    </div>
                    <div className={styles.about}>
                        <div className={styles.about__left}>
                            <h1 className={styles.left__title}>{title}</h1>
                            <div className={styles.left__bottom}>
                                {isLoading ? (
                                    <ShimmerEffect height={18} />
                                ) : (
                                    false
                                )}
                                <p>{selectedSpot?.address}</p>
                                <p>&nbsp; • &nbsp;</p>
                                {selectedSpot?.author?.avatar?.url && (
                                    <div
                                        className={cn(
                                            styles.user__image,
                                            styles.user__image_small
                                        )}
                                    >
                                        <Image
                                            src={
                                                selectedSpot?.author?.avatar
                                                    ?.url
                                            }
                                            alt={selectedSpot?.author?.nickname}
                                            fill="cover"
                                        />
                                    </div>
                                )}
                                &nbsp;
                                <p className={styles.user}>
                                    {selectedSpot?.author?.nickname === ""
                                        ? `User ${selectedSpot?.author?.id}`
                                        : selectedSpot?.author?.nickname}
                                </p>
                            </div>
                        </div>
                        <div className={styles.about__right}>
                            {!cookieState ? (
                                ""
                            ) : (
                                <>
                                    {isLoading ? (
                                        <ShimmerEffect height={60} />
                                    ) : (
                                        <>
                                            {figure.map((item) => (
                                                <p
                                                    className={
                                                        styles[
                                                            item?.value &&
                                                                "active"
                                                        ]
                                                    }
                                                >
                                                    {item.name}
                                                </p>
                                            ))}
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    {!cookieState ? (
                        <div className={styles.unlogin}>
                            <div className={styles.unlogin_message}>
                                <p>
                                    для просмотра наличия фигр, комментариев и
                                    описания требуется авторизация
                                </p>
                                <DefaultButton
                                    handleClick={() => {
                                        router.push("/login");
                                    }}
                                    type={"default"}
                                >
                                    <p>войти</p>
                                </DefaultButton>
                            </div>
                            <div className={styles.blur}></div>
                        </div>
                    ) : (
                        <>
                            {isLoading && <ShimmerEffect height={20} />}
                            {selectedSpot?.description && (
                                <>
                                    <hr />
                                    <p className={styles.descr}>
                                        {selectedSpot?.description}
                                    </p>
                                </>
                            )}
                            <hr />
                            <Comment
                                comments={selectedSpot?.comments}
                                userRatings={selectedSpot?.rating}
                            />
                            <SendComment id={id} />
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
