import axios, { InternalAxiosRequestConfig } from "axios";
import store from "store";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    channel: "WEB",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store.get("atk");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if ((error.response.status === 401 ) && !error.config.url.includes('/auth')) {
        store.remove("atk");
        store.remove("rtk");
        window.location.href = "/";
      }
      return Promise.reject(error);
    }
  );

export default axiosInstance