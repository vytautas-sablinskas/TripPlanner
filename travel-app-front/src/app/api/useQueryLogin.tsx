import type { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { client } from "./client";

type Response = {
    accessToken: string;
    refreshToken: string;
};

type LoginData = {
    email: string;
    password: string;
}

export const useQueryLogin = (requestData : LoginData) =>
useQuery<Response, AxiosError>({
    queryKey: ["login"],
    queryFn: () => client.get(`/login`, { params: requestData } ).then(res => res.data),
    enabled: false,
});