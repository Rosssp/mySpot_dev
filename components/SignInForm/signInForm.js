// "use server";
import React from "react";
import axios from "axios";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import DefaultButton from "../UI/defaultButton/defaultButton";
import Input from "../UI/input/input";
import styles from "./signinform.module.scss";
import { setCookie, getCookie } from "cookies-next";
const https = require("https");

export default function SignIn() {
    const router = useRouter();
    const [spinner, setSpinner] = React.useState(false);
    const handleFormSubmit = (values) => async (event) => {
        event.preventDefault();
        setSpinner(true);

        await axios
            // .post("/api/auth/login", values)
            .post(process.env.NEXT_PUBLIC_API + "/auth/sign_in", values, {
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false,
                }),
                insecure: true,
            })
            .then(function (response) {
                setSpinner(false);
                // console.log("res", response);
                setCookie("myspot_jwt2222", response?.headers?.authorization, {
                    path: "/",
                    // maxAge: 60 * 60 * 24 * 7, // 7 дней
                });
                router.reload();
            })
            .catch(function (error) {
                console.error("err", error);
                setSpinner(false);
                toast.error(`${error?.response?.data?.errors}`);

                // if (error?.response?.data?.error?.errors) {
                //     // toast.error(`${error?.response?.data?.error.errors}`);
                //     toast.error(`Неверные данные`);
                // } else {
                //     toast.error(`Проблемы с сервером, попробуйте позже`);
                // }
            });
    };
    return (
        <>
            <div className={styles.wrapper}>
                <Formik
                    initialValues={{
                        email: "",
                        password: "",
                    }}
                    validate={(values) => {
                        const errors = {};
                        if (!values.email) {
                            errors.email = "";
                        } else if (
                            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                                values.email
                            )
                        ) {
                            errors.email = "Invalid email address";
                        }

                        return errors;
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                    }) => (
                        <form onClick={handleSubmit} className={styles.form}>
                            <Input
                                type="email"
                                name="email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                placeholder="Почтовый адресс"
                                errors={errors?.email?.length > 0 && "error"}
                            />
                            <Input
                                type="password"
                                name="password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password}
                                placeholder="Пароль"
                            />
                            <DefaultButton
                                handleClick={handleFormSubmit(values)}
                                type="default"
                                spinner={spinner}
                                disabled={
                                    errors.email ||
                                    errors.email === "" ||
                                    values.password === ""
                                        ? true
                                        : false
                                }
                            >
                                <p>ВОЙТИ</p>
                            </DefaultButton>
                            <div className={styles.link}>
                                <Link href={"/signup"}>нет аккаунта?</Link>
                                <Link href={"/signup"}>забыли пароль?</Link>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
        </>
    );
}
