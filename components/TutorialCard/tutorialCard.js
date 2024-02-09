import React from "react";
import styles from "./tutorialCard.module.scss";
import Image from "next/image";
import Link from "next/link";
import useMediaQuery from "../../Hooks/useMediaQuery";

export default function TutorialCard({ image, title, descr, slug }) {
    const mob980 = useMediaQuery(980);
    const [transform, setTransform] = React.useState({
        rotationX: 0,
        rotationY: 0,
    });

    const handleMouseMove = (e) => {
        const { pageX, pageY } = e;
        const { left, top, width, height } =
            e.currentTarget.getBoundingClientRect();
        const x = (pageX - left - width / 2) / 40;
        const y = (pageY - top - height / 2) / 40;
        // console.log(pageY);
        setTransform({ rotationX: y, rotationY: x });
    };

    const handleMouseLeave = () => {
        setTransform({ rotationX: 0, rotationY: 0 });
    };

    return (
        <Link href={slug} className={styles.wrapper}>
            {mob980 ? (
                <div>
                    <div className={styles.container}>
                        <h2>{title}</h2>
                        <Image src={image} alt={`${title}`} fill="cover" />
                    </div>
                    {/* <p>{descr}</p> */}
                </div>
            ) : (
                <div
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        transform: `rotateX(${transform.rotationX}deg) rotateY(${transform.rotationY}deg)`,
                    }}
                >
                    <div className={styles.container}>
                        <h2>{title}</h2>
                        <Image src={image} alt={`${title}`} fill="cover" />
                    </div>
                    {/* <p>{descr}</p> */}
                </div>
            )}
        </Link>
    );
}
