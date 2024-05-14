import ENDPOINTS from "./Endpoints";

export const getTripDetails = async (tripId: any) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(
    ENDPOINTS.TRIP_DETAILS.GET_ALL_TRIP_DETAILS.replace(":id", tripId),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};

export const getTripDetailById = async (detailId: any, tripId: any) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(
    ENDPOINTS.TRIP_DETAILS.GET_TRIP_DETAILS_BY_ID.replace(
      ":detailId",
      detailId
    ).replace(":tripId", tripId),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};

export const getTripDetailForView = async (detailId: any, tripId: any) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(
    ENDPOINTS.TRIP_DETAILS.GET_TRIP_DETAIL_FOR_VIEW.replace(
      ":detailId",
      detailId
    ).replace(":tripId", tripId),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};

export const getUnselectedTrips = async () => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(ENDPOINTS.TRIP_DETAILS.GET_UNSELECTED_DETAILS, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const addTripDetails = async (data: any) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(ENDPOINTS.TRIP_DETAILS.CREATE_TRIP_DETAILS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...data }),
  });

  return response;
};

export const addTripToTripDetail = async (data: any) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(ENDPOINTS.TRIP_DETAILS.ADD_TRIP_TO_DETAIL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...data }),
  });

  return response;
};

export const editTripDetails = async (data: any) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(ENDPOINTS.TRIP_DETAILS.EDIT_TRIP_DETAILS, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...data }),
  });

  return response;
};

export const deleteTripDetail = async (id: any) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(
    ENDPOINTS.TRIP_DETAILS.DELETE_TRIP_DETAILS.replace(":id", id),
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};
