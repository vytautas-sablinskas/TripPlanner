const BASE_URL = "https://localhost:7211/api/v1";

const ENDPOINTS = {
    AUTHENTICATION: {
        LOGIN: `${BASE_URL}/login`,
        REGISTER: `${BASE_URL}/register`,
        LOGOUT: `${BASE_URL}/logout`,
        REFRESH_TOKEN: `${BASE_URL}/refreshToken`,
    },
    TRIPS: {
        CREATE_TRIP: `${BASE_URL}/trips`,
        GET_TRIPS: `${BASE_URL}/trips?filter=:filterName&page=:page`
    }
};

export default ENDPOINTS;