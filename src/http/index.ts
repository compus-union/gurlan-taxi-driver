import axios from "axios";
import config from "@/config";
import { useLoading } from "@/stores/loading";



export const driverInstance = axios.create({
  baseURL: config.SERVER_URL + "/driver",
});

driverInstance.interceptors.request.use(
  async function (config) {
    const loadingStore = useLoading();
    await loadingStore.setLoading(true);
    return config;
  },
  async function (error) {
    const loadingStore = useLoading();
    await loadingStore.setLoading(false);
    return Promise.reject(error);
  }
);

driverInstance.interceptors.response.use(
  async function (config) {
    const loadingStore = useLoading();
    await loadingStore.setLoading(false);
    return config;
  },
  async function (error) {
    const loadingStore = useLoading();
    await loadingStore.setLoading(false);
    return Promise.reject(error);
  }
);