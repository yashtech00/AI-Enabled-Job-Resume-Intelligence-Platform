import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    }
})



