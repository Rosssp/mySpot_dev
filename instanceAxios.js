import axios from "axios";
import { setCookie, getCookie, deleteCookie, hasCookie } from "cookies-next";
// import React from "react";
// const https = require("https");

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API,
    // withCredentials: true,
    headers: {
        // Authorization: token?.replace("myspot_jwt2222=", ""),
        Authorization: getCookie("myspot_jwt2222"),
    },
});

instance.interceptors.response.use(
    (response) => {
        // console.log(getCookie("myspot_jwt2222"));
        // setCookie("myspot_jwt2222", response?.headers?.headers);
        if (response.headers.authorization) {
            setCookie("myspot_jwt2222", response?.headers?.authorization, {
                path: "/",
                maxAge: 60 * 60 * 24 * 7, // 7 дней
            });
            instance.defaults.headers.common.Authorization =
                response.headers.Authorization;
            console.log(getCookie("myspot_jwt2222"));
        }
        return response;
    },
    (error) => {
        console.log(error);
        if (error.response.status === 401) {
            deleteCookie("myspot_jwt2222");
            // window.location.href = "/login";
        }
    }
);

// instance.interceptors.request.use(
//     (config) => {
//         const jwtToken = getCookie("myspot_jwt2222");
//         // Если есть токен, добавляем его в заголовок Authorization
//         if (jwtToken) {
//             config.headers.Authorization = jwtToken;
//             setCookie("myspot_jwt2222", {
//                 path: "/",
//                 maxAge: 60 * 60 * 24 * 7, // 7 дней
//             });
//         }
//         // if (!jwtToken) {
//         //     deleteCookie("myspot_jwt2222");
//         // }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

export default instance;
