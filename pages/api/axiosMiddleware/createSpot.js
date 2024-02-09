// import axios from "axios";
// import formidable from "formidable";

// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

// export default async function (req, res) {
//     const token = req.headers.cookie;
//     const valls = req.body;
//     // console.log("valls", valls);

//     const form = new formidable.IncomingForm();
//     // form.uploadDir = "./lol";
//     // form.keepExtensions = true;

//     form.parse(req, (err, fields, files) => {
//         if (err) {
//             res.status(500).json({
//                 errorParseFormData: err,
//             });
//             return;
//         }
//         // values = { ...fields, "spot[images][]": files["spot[images][]"] };
//         const formData = new FormData();
//         // const data = {};
//         // for (const [key, value] of Object.entries(fields)) {
//         //     // data[key] = value;
//         //     formData.append([key], value);
//         // }
//         // for (const [key, value] of Object.entries(files)) {
//         //     formData.append([key], value);
//         // }

//         Object.keys(fields).forEach((fieldName) => {
//             formData.append(fieldName, fields[fieldName]);
//         });
//         // console.log(files);
//         // Object.keys(files).forEach((fileFieldName) => {
//         //     formData.append(fileFieldName, files[fileFieldName]);
//         // });
//         console.log(formData);

//         // console.log(data);
//         // const obj = {};
//         // for (let key of formData.keys()) {
//         //     obj[key] = formData.get(key);
//         // }
//         // console.log(obj);

//         const instance = axios.create({
//             baseURL: process.env.NEXT_PUBLIC_API,
//             withCredentials: true,
//             headers: {
//                 "Content-Type": "multipart/form-data",
//                 Authorization: token?.replace("myspot_jwt2222=", ""),
//             },
//         });

//         instance
//             .post("/api/spots/register_new", formData)
//             .then(function (response) {
//                 const encodedToken = response?.headers?.authorization;
//                 const token = encodedToken?.replace("Bearer ", "");
//                 res.setHeader(
//                     "Set-Cookie",
//                     `myspot_jwt2222=${token}; Path=/; HttpOnly`
//                 );

//                 const { status, data } = response;
//                 res.status(status).json({
//                     data,
//                 });
//             })
//             .catch(function (error) {
//                 // const { status, data } = error.response;
//                 // res.status(status).json({
//                 //     error: data,
//                 // });
//                 res.status(400).json({
//                     error: error.response,
//                 });
//             });
//     });
// }
