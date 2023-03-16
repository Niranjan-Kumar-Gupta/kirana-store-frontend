import axios from "axios";
import baseUrl from "./server";


// const axiosInstance = axios.create({
//     baseURL: baseUrl,
//     headers: {
//         Accept: "*/*",
//         "Content-Type": "application/json",
//         authorization: localStorage.getItem("token")
//     },

//     withCredentials: true,
// });




export const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        Accept: "*/*",
        "Content-Type": "application/json"
    }
});

if(localStorage.getItem("token")){
    var token = localStorage.getItem("token")
    axiosInstance.defaults.headers.common["authorization"] = token;
}

export default axiosInstance;