import React, { useEffect, useRef, useState } from "react";
import styles from "./headerMenu.module.scss";
import cn from "classnames";
import Image from "next/image";
import DefaultButton from "../UI/defaultButton/defaultButton";
import { useRouter } from "next/router";
import images from "../../constants/images";
import { setCookie, deleteCookie } from "cookies-next";
import Input from "../UI/input/input";
import Spacer from "../UI/spacer/spacer";
import useMediaQuery from "../../Hooks/useMediaQuery";
// import instance from "../../pages/api/instance";
import instance from "../../instanceAxios";
// import instance from "../../instanceAxiosMiddleware";

export default function HeaderMenu() {
    const router = useRouter();
    const handleClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        router.push("/login");
    };
    const [getUserData, setGetUserData] = useState({
        nickname: "User",
        name: "Name",
        avatar: "",
        email: "",
        tg: "",
        vk: "",
        score: "",
    });
    const socialItems = [
        {
            id: 1,
            name: "tg",
            image: images.tg,
            url: "https://t.me/",
            type: "url",
        },
        {
            id: 2,
            name: "vk",
            image: images.vk,
            url: "https://vk.com/",
            type: "url",
        },
        // { image: images.email, url: "https://vk.com", type: "link" },
    ];
    const [isSocialsActive, setIsSocialsActive] = useState(false);
    const handleClickSocials = (id) => {
        if (isSocialsActive === id) {
            setIsSocialsActive(false);
        } else {
            setIsSocialsActive(id);
        }
    };
    const [isAuthorization, setIsAuthorization] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    async function fetchUserProfile() {
        try {
            // const response = await axios.get("/api/axiosMiddleware/getUser");
            const response = await instance.get("/api/profile.json");

            console.log("auth", response);
            // setCookie("myspot_jwt2222", response?.headers?.authorization);

            // const data = response.data.data;
            const data = response?.data;
            data && setIsLoading(false);
            !data && setIsAuthorization(false);
            console.log(data?.avatar);
            setGetUserData({
                nickname:
                    data?.nickname === "" ? `User ${data.id}` : data?.nickname,
                avatar: data?.avatar?.url,
                tg: !data?.tg ? "" : data?.tg,
                vk: !data?.vk ? "" : data?.vk,
                score: data?.score,
            });
            socialItems[0].url = data?.tg;
            socialItems[1].url = data?.vk;
        } catch (error) {
            console.log("errorAUTH", error);
        }
    }
    useEffect(() => {
        fetchUserProfile();
    }, [router]);

    const [isNickNameChange, setIsNickNameChange] = useState(false);
    const [isAvatarChange, setIsAvatarChange] = useState(false);
    const [avatarPic, setAvatarPic] = useState();
    const inputAvatarRef = useRef(null);

    const [btnDisabled, setBtnDisabled] = useState(true);
    const [putUserData, setPutUserData] = useState({});
    const [newPutUserData, setNewPutUserData] = useState({});
    useEffect(() => {
        const filledFields = Object.entries(putUserData).filter(
            ([key, value]) => value.length > 0
        );
        setBtnDisabled(filledFields.length < 1);
    }, [newPutUserData]);
    useEffect(() => {
        const filteredPutUserData = {};
        Object.entries(putUserData).forEach(([key, value]) => {
            if (value.length > 0) {
                filteredPutUserData[key] = value;
            }
        });
        setNewPutUserData(filteredPutUserData);
    }, [putUserData]);

    const updateProfile = (user) => async (e) => {
        await instance
            .put("/api/profile/update", { user })
            .then(function (response) {
                console.log("response", response);
                // setCookie("myspot_jwt2222", response?.headers?.authorization);
            })
            .catch(function (error) {
                console.log("error", error);
            });
    };
    const updateAvatar = async () => {
        let formData = new FormData();
        let inputFilesCurrent = inputAvatarRef.current;
        formData.append("avatar", inputFilesCurrent.files[0]);
        console.log(inputFilesCurrent);
        await instance
            .post("/api/profile/upload_avatar", formData)
            .then(function (response) {
                console.log("response", response);
                // setCookie("myspot_jwt2222", response?.headers?.authorization);
            })
            .catch(function (error) {
                console.log("error", error);
            });
    };

    const handleUpdateData = async (e) => {
        e.preventDefault();
        const isEmptyObject = (obj) => {
            return Object.keys(obj).length === 0 && obj.constructor === Object;
        };

        try {
            if (avatarPic !== undefined && !isEmptyObject(newPutUserData)) {
                await updateProfile(newPutUserData)();
                await updateAvatar();
                router.reload();
            } else if (avatarPic !== undefined) {
                await updateAvatar();
                router.reload();
            } else if (!isEmptyObject(newPutUserData)) {
                await updateProfile(newPutUserData)();
                router.reload();
            } else {
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSignOut = async () => {
        console.log("анлог");
        await instance
            .delete("/auth/sign_out")
            .then(function (response) {
                console.log("response", response);
                deleteCookie("myspot_jwt2222");
                router.reload();
            })
            .catch(function (error) {
                console.log("error", error);
            });
    };

    return (
        <div className={cn(styles.wrapper, styles[isLoading && "no_auth"])}>
            <div className={cn("main__wrapper", styles.container)}>
                {!isLoading ? (
                    ""
                ) : (
                    <>
                        {!isAuthorization && (
                            <div className={styles.no_auth__content}>
                                <h2>
                                    Для доступа к редактированию профиля,
                                    просмотра фигур на споте, его описание,
                                    рейтинга и комментариев, необходимо
                                    авторизоваться
                                </h2>
                                <DefaultButton
                                    handleClick={handleClick}
                                    type={"default"}
                                >
                                    <p>войти</p>
                                </DefaultButton>
                            </div>
                        )}
                    </>
                )}
                <div className={styles.user_container}>
                    <div className={styles.user_profile}>
                        <label className={styles.image}>
                            <input
                                id="files"
                                type="file"
                                name="images"
                                accept="image/png, image/gif, image/jpeg"
                                ref={inputAvatarRef}
                                onChange={(event) => {
                                    const fileList = event.target.files;
                                    Promise.all(
                                        Array.from(fileList).map((file) => {
                                            return new Promise((resolve) => {
                                                const reader = new FileReader();
                                                reader.readAsDataURL(file);
                                                reader.onload = () =>
                                                    resolve(reader.result);
                                            });
                                        })
                                    ).then((images) => {
                                        setAvatarPic(images);
                                        setIsAvatarChange(true);
                                        setBtnDisabled(false);
                                    });
                                }}
                            />
                            {!isAvatarChange ? (
                                <Image
                                    fill="cover"
                                    src={
                                        getUserData?.avatar
                                            ? getUserData?.avatar
                                            : ""
                                    }
                                />
                            ) : (
                                <Image fill="cover" src={avatarPic[0]} />
                            )}
                        </label>
                        <div className={styles.nickName}>
                            <div className={styles.nickName_container}>
                                <p
                                    style={{
                                        visibility: `${
                                            isNickNameChange
                                                ? "hidden"
                                                : "visible"
                                        }`,
                                        opacity: `${
                                            isNickNameChange ? "0" : "1"
                                        }`,
                                    }}
                                    onClick={() => setIsNickNameChange(true)}
                                    className={styles.user_nickName}
                                >
                                    {getUserData.nickname}
                                </p>
                                {isNickNameChange && (
                                    <>
                                        <input
                                            placeholder="Новый никнейм"
                                            className={styles.changeNickName}
                                            value={putUserData.nickname}
                                            onChange={(e) => {
                                                setPutUserData({
                                                    ...putUserData,
                                                    nickname: e.target.value,
                                                });
                                            }}
                                        />
                                        <p
                                            className={styles.close}
                                            onClick={() => {
                                                setIsNickNameChange(false);
                                                setPutUserData({
                                                    ...putUserData,
                                                    nickname: "",
                                                });
                                            }}
                                        >
                                            ✕
                                        </p>
                                    </>
                                )}
                            </div>
                            <ul className={styles.socials}>
                                {socialItems.map((item) => (
                                    <li key={item.id}>
                                        <div
                                            className={styles.socials_popOver}
                                            style={{
                                                display:
                                                    isSocialsActive === item.id
                                                        ? "block"
                                                        : "none",
                                            }}
                                        >
                                            <Input
                                                pattern={`${item.url}`}
                                                type="url"
                                                placeholder={`${item.url}`}
                                                value={putUserData[item.name]}
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value;
                                                    if (
                                                        value.startsWith(
                                                            `${item.url}`
                                                        )
                                                    ) {
                                                        setPutUserData({
                                                            ...putUserData,
                                                            [item.name]: value,
                                                        });
                                                    }
                                                    if (value < item.url + 1) {
                                                        const {
                                                            [item.name]:
                                                                removedField,
                                                            ...newPutUserData
                                                        } = putUserData;
                                                        setPutUserData(
                                                            newPutUserData
                                                        );
                                                    }
                                                }}
                                            />
                                        </div>
                                        <a
                                            className={styles.socials_icons}
                                            onClick={() =>
                                                handleClickSocials(item.id)
                                            }
                                        >
                                            <Image
                                                src={item.image}
                                                alt={item.url}
                                            />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className={styles.pts}>
                            <p>{getUserData.score} PTS</p>
                        </div>
                    </div>
                    {/* <div className={styles.user_other}>
                        <Input type="mail" placeholder={"Смена почты"} />
                        <Input type="password" placeholder={"Смена пароля"} />
                    </div> */}
                </div>
                <div className={styles.bottom}>
                    <DefaultButton
                        handleClick={handleUpdateData}
                        disabled={btnDisabled}
                        type={"withOutBG"}
                    >
                        <h1> Принять</h1>
                    </DefaultButton>
                    <DefaultButton
                        handleClick={() => handleSignOut()}
                        type={"withOutBG"}
                    >
                        <h1>Выйти</h1>
                    </DefaultButton>
                </div>
            </div>
        </div>
    );
}
