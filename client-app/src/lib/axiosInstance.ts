import axios from "axios";
import { CONFIG } from "../config";

const axiosInstance = axios.create({
  baseURL: CONFIG.api,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
