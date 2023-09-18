import axios from "axios";

export const authInstance = axios.create({
  baseURL: "http://192.168.1.15:3000/api/v1",
});
