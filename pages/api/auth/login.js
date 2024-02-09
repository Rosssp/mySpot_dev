/* eslint-disable import/no-anonymous-default-export */
// import { decode, jwt, verify, sign } from "jsonwebtoken";
import axios from "axios";
// import { serialize } from "cookie";
// const jwt = require("jsonwebtoken");

const secret = process.env.NEXT_SECRET;
export default async function (req, res) {
    const { email, password } = req.body;
    await axios
        .post(process.env.NEXT_PUBLIC_API + "/auth/sign_in", {
            email,
            password,
        })
        .then(function (response) {
            const encodedToken = response?.headers?.authorization;
            const token = encodedToken.replace("Bearer ", "");
            const lol = response?.headers;
            // console.log(lol?.expiry);

            // const serialised = serialize("myspot_jwt2222", token, {
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV !== "development",
            //     sameSite: "strict",
            //     maxAge: 60 * 60 * 24 * 30, //30 days
            //     path: "/",
            // });

            // 222222222myspot_jwt=
            res.setHeader(
                "Set-Cookie",
                `myspot_jwt2222=${token}; Path=/; HttpOnly`
            );

            const { status, data } = response;
            res.status(status).json({
                data,
            });
        })
        .catch(function (error) {
            const { status, data } = error.response;
            res.status(status).json({
                error: data,
            });
        });
}
