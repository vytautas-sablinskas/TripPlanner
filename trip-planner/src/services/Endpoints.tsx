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
    GET_SHARE_INFORMATION: `${BASE_URL}/trips/:id/shareInformation`,
    EDIT_TRIP: `${BASE_URL}/trips/:id`,
    DELETE_TRIP: `${BASE_URL}/trips/:id`,
    UPDATE_SHARE_INFORMATION: `${BASE_URL}/trips/:id/shareInformation`,
    UPDATE_SHARE_LINK: `${BASE_URL}/trips/:id/shareInformation/link`,
    GET_SHARE_TRIP_INFORMATION: `${BASE_URL}/trips/shared/:linkId`,
    GET_USER_TRIPS: `${BASE_URL}/trips/user`,
  },
  TRIP_DETAILS: {
    GET_ALL_TRIP_DETAILS: `${BASE_URL}/trips/:id/tripDetails/`,
    GET_TRIP_DETAILS_BY_ID: `${BASE_URL}/trips/:tripId/tripDetails/:detailId`,
    GET_TRIP_DETAIL_FOR_VIEW: `${BASE_URL}/trips/:tripId/tripDetails/:detailId/view`,
    GET_UNSELECTED_DETAILS: `${BASE_URL}/tripDetails/notSelected`,
    CREATE_TRIP_DETAILS: `${BASE_URL}/tripDetails`,
    ADD_TRIP_TO_DETAIL: `${BASE_URL}/tripDetails/addToTrip`,
    EDIT_TRIP_DETAILS: `${BASE_URL}/tripDetails`,
    DELETE_TRIP_DETAILS: `${BASE_URL}/tripDetails/:id`,
  },
  TRIP_TRAVELLERS: {
    GET_ALL_TRIP_TRAVELLERS: `${BASE_URL}/trips/:tripId/travellers`,
    ADD_TRIP_TRAVELLERS: `${BASE_URL}/trips/:tripId/travellers/create`,
    DELETE_TRIP_TRAVELLER: `${BASE_URL}/trips/:tripId/travellers/:email`,
    EDIT_TRIP_TRAVELLER: `${BASE_URL}/trips/:tripId/travellers/:travellerId/update`,
    ADD_USER_TO_NOTIFICATION: `${BASE_URL}/travellers/addToNotification`,
  },
  USER: {
    GET_INFORMATION: `${BASE_URL}/user/information`,
  },
  NOTIFICATIONS: {
    GET_USER_NOTIFICATIONS: `${BASE_URL}/notifications`,
    MARK_NOTIFICATIONS_AS_READ: `${BASE_URL}/notifications/status`,
    CHANGE_INVITATION_STATUS: `${BASE_URL}/notifications/:notificationId`,
  },
  TRIP_BUDGETS: {
    GET_TRAVELLERS_MINIMAL_INFO: `${BASE_URL}/trips/:tripId/budgets/travellerInfo`,
    ADD_BUDGET: `${BASE_URL}/trips/:tripId/budgets`,
    EDIT_BUDGET: `${BASE_URL}/trips/:tripId/budgets/:budgetId`,
    GET_BUDGETS: `${BASE_URL}/trips/:tripId/budgets`,
    GET_BUDGET: `${BASE_URL}/trips/:tripId/budgets/:budgetId`,
    GET_CURRENT_EDIT_INFO: `${BASE_URL}/trips/:tripId/budgets/:budgetId/info`,
    DELETE_BUDGET: `${BASE_URL}/trips/:tripId/budgets/:budgetId`,
  },
  PROFILE: {
    GET_USER_PROFILE: `${BASE_URL}/profile`,
    CHANGE_PASSWORD: `${BASE_URL}/profile/password`,
    CHANGE_PROFILE_INFORMATION: `${BASE_URL}/profile/information`,
  },
  TRIP_DOCUMENTS: {
    ADD_NEW_DOCUMENT: `${BASE_URL}/trips/:tripId/tripDetails/:tripDetailId/documents`,
    EDIT_DOCUMENT: `${BASE_URL}/trips/:tripId/tripDetails/:tripDetailId/documents/:documentId`,
    DELETE_DOCUMENT: `${BASE_URL}/trips/:tripId/tripDetails/:tripDetailId/documents/:documentId`,
    GET_DOCUMENT_MEMBERS: `${BASE_URL}/trips/:tripId/tripDetails/:tripDetailId/documents/:documentId`,
    GET_USER_DOCUMENTS: `${BASE_URL}/documents/user`,
  },
  EXPENSES: {
    ADD_EXPENSE: `${BASE_URL}/trips/:tripId/budgets/:budgetId/expenses`,
    EDIT_EXPENSE: `${BASE_URL}/trips/:tripId/budgets/:budgetId/expenses/:expenseId`,
    DELETE_EXPENSE: `${BASE_URL}/trips/:tripId/budgets/:budgetId/expenses/:expenseId`,
  },
  RECOMMENDATIONS: {
    GET_RECOMMENDATIONS: `${BASE_URL}/recommendations`,
    GET_RECOMMENDATION_WEIGHTS: `${BASE_URL}/recommendations/weights`,
    EDIT_RECOMMENDATION_WEIGHTS: `${BASE_URL}/recommendations/weights`,
  },
};

export default ENDPOINTS;
