import axios from "axios";
import config from "@/config";
import { useLoading } from "@/stores/loading";

const loadingStore = useLoading();

export const authInstance = axios.create({
  baseURL: config.SERVER_URL + "/driver",
});

authInstance.interceptors.request.use(
  async function (config) {
    await loadingStore.setLoading(true);
    return config;
  },
  async function (error) {
    await loadingStore.setLoading(false);
    return Promise.reject(error);
  }
);

authInstance.interceptors.response.use(
  async function (config) {
    await loadingStore.setLoading(false);
    return config;
  },
  async function (error) {
    await loadingStore.setLoading(false);
    return Promise.reject(error);
  }
);
