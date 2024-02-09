import styles from "./trick.module.scss";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import axios from "axios";
import Spacer from "../../../components/UI/spacer/spacer";
import ShimmerEffect from "../../../components/UI/ShimmerEffect/shimmerEffect";
import TutorialCard from "../../../components/TutorialCard/tutorialCard";
import useMediaQuery from "../../../Hooks/useMediaQuery";
import { motion } from "framer-motion";
import Slider from "../../../components/Slider/slider";
import { shuffle } from "lodash";

export default function index({ trick, isLoading, tricks }) {
    // const mockCards = [
    //     {
    //         src: "https://i.ytimg.com/vi/BwdpuzD3Wcs/maxresdefault.jpg",
    //     },
    //     {
    //         src: "https://i.ytimg.com/vi/BwdpuzD3Wcs/maxresdefault.jpg",
    //     },
    //     {
    //         src: "https://i.ytimg.com/vi/BwdpuzD3Wcs/maxresdefault.jpg",
    //     },
    //     {
    //         src: "https://i.ytimg.com/vi/BwdpuzD3Wcs/maxresdefault.jpg",
    //     },
    // ];
    console.log("trick", trick);
    console.log("tricks", tricks);
    const mob768 = useMediaQuery(768);
    const [isLoadingState, setIsLoadingState] = useState(true);
    useEffect(() => {
        if (isLoading) {
            setIsLoadingState(true);
        } else {
            setIsLoadingState(false);
        }
    }, [isLoading]);

    // const currentTrickId = trick?.id;
    // const filteredTricks = tricks.filter(
    //     (trick) => trick.id !== currentTrickId
    // );
    // const shuffledTricks = shuffle(filteredTricks);

    return (
        <motion.div className={styles.wrapper}>
            <Head>
                <title>
                    {"MY SPOT | как сделать " +
                        trick.title +
                        " | Трюки, Скейт, Споты, места для катания, Скейт-парки, скейт парки"}
                </title>
                <meta
                    name="description"
                    content={
                        trick.title +
                        " | Трюки, Скейт, Споты, места для катания, Скейт-парки, скейт парки"
                    }
                />
                <meta
                    name="keywords"
                    content="скйетборд, трюки, skateboard, tricks, трюки скйет, trick skate, sport, spot, spots, споты, спот, места для катания, Скейт-парки"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <meta property="og:title" content={"MY SPOT - споты и трюки"} />
                <meta property="og:type" content="website" />
                <meta
                    property="og:description"
                    content={`Как сделать ${trick.title} | Трюки, Скейт, Споты, места для катания, Скейт-парки, скейт парки`}
                />
                {/* <meta
                    property="og:image"
                    content="https://example.com/trick-image.png"
                /> */}
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={"main__height main__wrapper"}>
                <Spacer size={"xl"} />

                <h1 className={styles.title}>{trick.title} —</h1>
                <div className={styles.slider}>
                    <Slider
                        spot={true}
                        images={trick?.images}
                        perView={
                            trick?.images?.length === 1
                                ? 1
                                : trick?.images?.length === 2
                                ? 2
                                : mob768 && trick?.images?.length > 2
                                ? 2
                                : 3
                        }
                    />
                </div>
                {isLoadingState && <ShimmerEffect height={200} />}
                <p className={styles.description}>{trick?.description}</p>
                <Spacer size={"xl"} />
                <h1>ЕЩЁ ТРЮКИ —</h1>
                <div className={styles.anotherTricks}>
                    {tricks?.slice(0, 3)?.map((item) => (
                        <TutorialCard
                            // image={item?.images}
                            image={item?.images[0]?.url}
                            title={item?.title}
                            slug={item?.slug}
                        />
                    ))}
                </div>
            </div>
            <Spacer size={"xl"} />
        </motion.div>
    );
}

export async function getServerSideProps({ params }) {
    const trick = await axios
        .get(process.env.NEXT_PUBLIC_API + `/api/tricks/${params.slug}.json`)
        .then((response) => response?.data);
    const tricks = await axios
        .get(process.env.NEXT_PUBLIC_API + `/api/tricks.json`)
        .then((response) => response?.data);

    return {
        props: {
            trick: trick,
            tricks: tricks,
            isLoading: false,
        },
    };
}
