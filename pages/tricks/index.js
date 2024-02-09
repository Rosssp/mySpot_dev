import styles from "./tutorials.module.scss";
import React, { useEffect, useState } from "react";
import TutorialCard from "@/components/TutorialCard/tutorialCard";
import Spacer from "@/components/UI/spacer/spacer";
import Pagination from "@/components/UI/Pagination/pagination";
import Head from "next/head";
import Search from "@/components/Search/search";
import instance from "../../instanceAxios";
import axios from "axios";
import { motion } from "framer-motion";
import cn from "classnames";

export default function index({ data }) {
    const [tricks, setTricks] = useState(data);
    console.log(tricks);

    const [fetching, setFetching] = useState(false);
    const [currentPage, setCurrentPage] = useState(9);

    useEffect(() => {
        document.addEventListener("scroll", scrollHandler);
        return function () {
            document.removeEventListener("scroll", scrollHandler);
        };
    }, []);

    const scrollHandler = (e) => {
        if (
            e.target.documentElement.scrollHeight -
                (e.target.documentElement.scrollTop + window.innerHeight) <
            100
        ) {
            setFetching(true);
            setTimeout(() => {
                setFetching(false);
            }, 200);
        }
    };

    useEffect(() => {
        if (fetching) {
            setTimeout(() => {
                setCurrentPage((prev) => prev + 9);
            }, 500);
        }
    }, [fetching]);

    return (
        <motion.div className={styles.warpper}>
            <Head>
                <title>MY SPOT | ТРЮКИ</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <meta property="og:title" content="MY SPOT" key="title" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="144x144"
                    href="/icon.svg"
                />
                <script
                    src="https://api-maps.yandex.ru/3.0/?apikey=7066165f-a263-468f-9123-b4a3a32bdfb3&lang=ru_RU"
                    type="text/javascript"
                ></script>
            </Head>
            <div className="main__height main__wrapper">
                <Spacer size={"xl"} />
                <div className={styles.filter}>
                    <h1>ТРЮКИ —</h1>
                    <Search data={tricks} placeholder="Поиск" />
                </div>
                <Spacer size={"md"} />
                <div className={styles.cards}>
                    {tricks?.slice(0, currentPage).map((item) => (
                        <>
                            <TutorialCard
                                slug={"tricks/" + item?.slug}
                                title={item?.title}
                                // descr={item.descr}
                                image={item?.images[0]?.url}

                                // image={
                                //     "https://klike.net/uploads/posts/2022-11/1667980142_030.jpg"
                                // }
                            />
                        </>
                    ))}
                </div>
                {/* <Spacer size={"md"} /> */}
                {/* <Pagination /> */}
                <Spacer size={"xl"} />
            </div>
        </motion.div>
    );
}

export async function getServerSideProps({ params }) {
    try {
        const tricks = await axios
            .get(process.env.NEXT_PUBLIC_API + "/api/tricks.json")
            .then((response) => response?.data);

        return {
            props: {
                data: tricks,
            },
        };
    } catch (error) {
        return { redirect: { destination: "/", permanent: false } };
    }
}