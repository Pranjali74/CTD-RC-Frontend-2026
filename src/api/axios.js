import axios from "axios";
import apis from "../config/api.json"



const api = axios.create({
    baseURL: apis.BASE_URL,
    withCredentials: true,
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;