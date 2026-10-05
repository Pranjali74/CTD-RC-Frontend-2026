import axios from "axios";
//import apis from "../config/api.json";

const api = axios.create({
  //baseURL: import.meta.env.VITE_API_BASE_URL ,
  baseURL: "/api",
  withCredentials: true,
});

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