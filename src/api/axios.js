import axios from "axios";
import apiConfig from "../config/api.json";

const api = axios.create({
  baseURL: apiConfig.baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;