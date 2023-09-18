import axios from "axios";
import config from "@/config";
import { useLoading } from "@/stores/loading";

export const authInstance = axios.create({
  baseURL: config.SERVER_URL,
});

authInstance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

