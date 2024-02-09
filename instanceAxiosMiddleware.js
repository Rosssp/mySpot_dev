import axios from "axios";
import { getCookies, setCookie, deleteCookie } from "cookies-next";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API,
});

const setAuthToken = (token) => {
    if (token) {
        instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete instance.defaults.headers.common["Authorization"];
    }
};

const saveTokenToCookies = (token) => {
    setCookie("myspot_jwt2222", token, {
        path: "/",
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });
};

const clearTokenFromCookies = () => {
    deleteCookie("myspot_jwt2222", {
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });
};

const middleware = async (config) => {
    const cookies = getCookies();
    const token = cookies.myspot_jwt2222;
    setAuthToken(token);

    if (config.method === "get") {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
};

instance.interceptors.request.use(middleware);

instance.interceptors.response.use(
    (response) => {
        const token = response?.headers?.authorization;
        if (token) {
            saveTokenToCookies(token);
        }
        return response;
    },
    (error) => {
        // При плохом ответе, удаляем токен из кук
        clearTokenFromCookies();
        return Promise.reject(error);
    }
);

export default instance;
