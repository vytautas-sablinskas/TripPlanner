import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { refreshAuth } from "./refreshAuth";

export const client = axios.create({
  baseURL: "https://localhost:7211",
});

export const setHeaderToken = (token: string) => {
  client.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const removeHeaderToken = () => {
  delete client.defaults.headers.common.Authorization;
};

createAuthRefreshInterceptor(client, refreshAuth, {
  statusCodes: [401],
  pauseInstanceWhileRefreshing: true,
});