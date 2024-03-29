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
        GET_TRIPS: `${BASE_URL}/trips?filter=:filterName&page=:page`,
        GET_TRIP: `${BASE_URL}/trips/:id`,
        GET_TRIP_TIME: `${BASE_URL}/trips/:id/time`,
        EDIT_TRIP: `${BASE_URL}/trips/:id`,
        DELETE_TRIP: `${BASE_URL}/trips/:id`,
    },
    TRIP_DETAILS: {
        GET_ALL_TRIP_DETAILS: `${BASE_URL}/trips/:id/tripDetails/`,
        GET_TRIP_DETAILS_BY_ID: `${BASE_URL}/trips/:tripId/tripDetails/:detailId`,
        CREATE_TRIP_DETAILS: `${BASE_URL}/tripDetails`,
        EDIT_TRIP_DETAILS: `${BASE_URL}/tripDetails`,
        DELETE_TRIP_DETAILS: `${BASE_URL}/tripDetails/:id`,
    },
    TRIP_TRAVELLERS: {
        GET_ALL_TRIP_TRAVELLERS: `${BASE_URL}/trips/:tripId/travellers`,
        ADD_TRIP_TRAVELLERS: `${BASE_URL}/trips/:tripId/travellers/create`,
        DELETE_TRIP_TRAVELLER: `${BASE_URL}/trips/:tripId/travellers/:email`,
        EDIT_TRIP_TRAVELLER: `${BASE_URL}/trips/:tripId/travellers/:travellerId/update`
    },
    USER: {
        GET_INFORMATION: `${BASE_URL}/user/information`,
    },
    NOTIFICATIONS: {
        GET_USER_NOTIFICATIONS: `${BASE_URL}/notifications`,
        MARK_NOTIFICATIONS_AS_READ: `${BASE_URL}/notifications/status`,
        CHANGE_INVITATION_STATUS: `${BASE_URL}/notifications/:notificationId`
    }
};

export default ENDPOINTS;