import React from "react";
import styles from "./ratingsLayout.module.scss";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import images from "../../constants/images";
import cn from "classnames";
import ShimmerEffect from "../../components/UI/ShimmerEffect/shimmerEffect";
import Slider from "../../components/Slider/slider";

export default function RatingsLayout({
    id,
    spotImages,
    avatar,
    name,
    socialItems,
    score,
    rating,
    address,
    baloon,
    closeFn,
}) {
    const exapmleSocialItems = [
        {
            id: 1,
            name: "tg",
            image: images.tg,
            url: socialItems && socialItems[0],
        },
        {
            id: 2,
            name: "vk",
            image: images.vk,
            url: socialItems && socialItems[1],
        },
        // { image: images.email, url: "https://vk.com", type: "link" },
    ];
    console.log(spotImages);
    return (
        <div className={cn(styles.wrapper, styles[baloon && "popOverSpot"])}>
            {baloon && (
                <div className={styles.close} onClick={closeFn}>
                    {/* X */}✕
                </div>
            )}
            {avatar && (
                <div className={cn(styles.image, styles.slider)}>
                    <Image fill="cover" src={avatar} />
                </div>
            )}
            {spotImages && (
                <div className={cn(styles.image, styles.slider)}>
                    <Slider
                        perView={1}
                        spot={true}
                        images={spotImages}
                        id={id}
                    />
                </div>
            )}
            <div className={styles.middle}>
                <div className={styles.spotUserName}>
                    <h1 className={styles.name}>{name}</h1>
                </div>
                {address && <p>{address}</p>}
                {score && (
                    <ul className={styles.socials}>
                        {exapmleSocialItems.map((item, i) => (
                            <>
                                {item.url && (
                                    <li key={i}>
                                        <a
                                            style={{ zIndex: 100 }}
                                            target="_blank"
                                            href={item?.url}
                                            className={styles.socials_icons}
                                        >
                                            <Image
                                                src={item?.image}
                                                alt={item?.url}
                                            />
                                        </a>
                                    </li>
                                )}
                            </>
                        ))}
                    </ul>
                )}
            </div>
            {rating && (
                <div className={styles.score}>
                    <p>Рейтинг : {rating}</p>
                </div>
            )}
            {score && (
                <div
                    className={cn(
                        styles.score,
                        styles[baloon && "score_baloon"]
                    )}
                >
                    <p>{score} PTS</p>
                </div>
            )}
        </div>
    );
}
