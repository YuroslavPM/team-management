import axios from "axios";
import { authToken, envConfig } from "./env.config";

export const axiosClient = axios.create({
  baseURL: envConfig.apiUrl,
  timeout: 1000 * 20,
});

if (authToken) {
  axiosClient.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
}