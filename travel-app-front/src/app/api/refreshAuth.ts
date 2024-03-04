import router from "next/router";
import { client, setHeaderToken } from "./client";

export const fetchNewToken = async () => {
  try {
    const token: string = await client
      .get("https://localhost:7211/api/v1/refreshToken")
      .then(res => res.data.token);
    return token;
  } catch (error) {
    return null;
  }
};

export const refreshAuth = async (failedRequest: any) => {
  const newToken = await fetchNewToken();

  if (newToken) {
    failedRequest.response.config.headers.Authorization = "Bearer " + newToken;
    setHeaderToken(newToken);

    return Promise.resolve(newToken);
  } else {
    router.push("/login");
    
    return Promise.reject();
  }
};