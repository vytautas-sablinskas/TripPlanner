const baseURL = "https://localhost:7211/api/v1";

export const ENDPOINT_PATHS = {
    BASE_URL: baseURL,
    REFRESH_TOKEN: `${baseURL}/refreshToken`,
    LOGIN: `${baseURL}/login`,
    LOGOUT: `${baseURL}/logout`,
    REGISTER: `${baseURL}/register`,
} 