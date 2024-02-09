import React, { useEffect, useState } from "react";
import Image from "next/image";
import images from "../../constants/images.js";
import styles from "./header.module.scss";
import Link from "next/link.js";
import cn from "classnames";
import HeaderMenu from "../HeaderMenu/headerMenu.js";
import { motion } from "framer-motion";
import { useRouter } from "next/router.js";
const variants = {
    open: { opacity: 1, y: 0, display: "block" },
    closed: {
        opacity: 0,
        y: "-5vh",
        transitionEnd: {
            display: "none",
        },
    },
};
export default function Header() {
    const router = useRouter();
    useEffect(() => {
        const handleRouteChange = () => {
            setIsActive(false);
        };
        router.events.on("routeChangeStart", handleRouteChange);
        return () => {
            router.events.off("routeChangeStart", handleRouteChange);
        };
    }, [router.events]);

    const nav = [
        { title: "Карта", url: "/map" },
        { title: "Трюки", url: "/tricks" },
        { title: "Рейтинги", url: "/ratings" },
        { title: "О нас", url: "/about-us" },
    ];
    const [isActive, setIsActive] = useState(false);

    return (
        <header className={styles.header}>
            <div className={`main__wrapper ${styles.header__items}`}>
                <div className={styles.header__logo}>
                    <Link href={"/"}>
                        <Image src={images.logo} alt={"logo"} />
                    </Link>
                </div>
                <nav>
                    <ul>
                        {nav.map((item) => (
                            <li key={item.title}>
                                <Link href={item.url}>
                                    <p>{item.title}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div
                    className={cn(
                        styles.header__wrapper,
                        styles[isActive && "is-active"]
                    )}
                    onClick={() => setIsActive((prev) => !prev)}
                >
                    <div className={styles.burger}>
                        <span></span>
                    </div>
                </div>
            </div>
            <motion.div
                initial={{ display: "none" }}
                className={styles.burgerMenu_wrapper}
                animate={isActive ? "open" : "closed"}
                variants={variants}
            >
                <HeaderMenu />
            </motion.div>
        </header>
    );
}
