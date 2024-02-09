import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import { Grid, Navigation } from "swiper";
import Image from "next/image";
import styles from "./slider.module.scss";
import arrow from "../../assets/images/Arrow.svg";
import cn from "classnames";
import ShimmerEffect from "../UI/ShimmerEffect/shimmerEffect";

export default function Slider({ images, perView, id, spot, isLoading }) {
    console.log(images);
    const [img, setImg] = useState(false);
    useEffect(() => {
        setImg(images?.length >= 1 ? true : false);
    }, [images]);

    return (
        <>
            <Swiper
                key={id}
                slidesPerView={perView}
                draggable={true}
                // grid={{
                //     rows: 3,
                // }}
                navigation={{
                    prevEl: `.prev-${id}`,
                    nextEl: `.next-${id}`,
                    lockClass: ".disabled",
                }}
                modules={[Grid, Navigation]}
                className={styles.slider}
            >
                {isLoading && (
                    <div
                        style={{
                            opacity: 1,
                            transition: "opacity 0.5s ease",
                        }}
                    >
                        <SwiperSlide>
                            <ShimmerEffect />
                        </SwiperSlide>
                    </div>
                )}
                {console.log(images)}
                {img ? (
                    <>
                        {images?.map((item, i) => (
                            <SwiperSlide key={i}>
                                <Image
                                    src={spot ? item?.url : item?.src}
                                    fill="cover"
                                    placeholder={<ShimmerEffect />}
                                />
                            </SwiperSlide>
                        ))}
                    </>
                ) : (
                    <>
                        <div
                            style={{
                                opacity: 1,
                                transition: "opacity 0.5s ease",
                            }}
                        >
                            <SwiperSlide>
                                <ShimmerEffect />
                            </SwiperSlide>
                        </div>
                    </>
                )}
            </Swiper>
            <div className={styles.slider__prev}>
                <Image
                    src={arrow}
                    className={cn(`prev-${id}`, styles[spot && "smaller"])}
                />
            </div>
            <div className={styles.slider__next}>
                <Image
                    src={arrow}
                    className={cn(`next-${id}`, styles[spot && "smaller"])}
                    fill="cover"
                />
            </div>
        </>
    );
}
