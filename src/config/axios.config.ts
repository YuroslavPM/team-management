import axios from "axios";
import { envConfig } from "./env.config";

export const axiosClient = axios.create({
  baseURL: envConfig.apiUrl,
  timeout: 1000 * 20,
});

const token = localStorage.getItem("authToken");
if (token) {
  axiosClient.defaults.headers.common["Authorization"] = `Token ${token}`;
}