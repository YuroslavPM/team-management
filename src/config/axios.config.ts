import axios from "axios";
import { envConfig } from "./env.config";

export const axiosClient = axios.create({
  baseURL: envConfig.apiUrl,
  timeout: 1000 * 20,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

