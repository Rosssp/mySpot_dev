import axios from "axios";

export default async function (req, res) {
    const token = req.headers.cookie;

    const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API,
        withCredentials: true,
        headers: {
            Authorization: token?.replace("myspot_jwt2222=", ""),
        },
    });

    await instance
        .get("/api/profile.json")
        .then(function (response) {
            const encodedToken = response?.headers?.authorization;
            const token = encodedToken?.replace("Bearer ", "");
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
