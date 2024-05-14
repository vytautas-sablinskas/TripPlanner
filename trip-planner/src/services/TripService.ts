import ENDPOINTS from "./Endpoints";

export const addTrip = async (formData: FormData) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(ENDPOINTS.TRIPS.CREATE_TRIP, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return response;
};

export const editTrip = async (formData: FormData, id: any) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(ENDPOINTS.TRIPS.EDIT_TRIP.replace(":id", id), {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return response;
};

export const deleteTrip = async (id: any) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(ENDPOINTS.TRIPS.EDIT_TRIP.replace(":id", id), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const getTripsList = async (filter: any, page: any) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(
    ENDPOINTS.TRIPS.GET_TRIPS.replace(":filterName", filter).replace(
      ":page",
      page
    ),
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

export const getTrip = async (id: any) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(ENDPOINTS.TRIPS.GET_TRIP.replace(":id", id), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const getTripShareInformation = async (id: any) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(
    ENDPOINTS.TRIPS.GET_SHARE_INFORMATION.replace(":id", id),
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

export const updateTripShareInformation = async (id: any, form: any) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(
    ENDPOINTS.TRIPS.UPDATE_SHARE_INFORMATION.replace(":id", id),
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    }
  );

  return response;
};

export const updateShareTripLink = async (id: any) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(
    ENDPOINTS.TRIPS.UPDATE_SHARE_LINK.replace(":id", id),
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};

export const getTripTime = async (id: any) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(
    ENDPOINTS.TRIPS.GET_TRIP_TIME.replace(":id", id),
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

export const getShareTripInformation = async (linkId: any) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(
    ENDPOINTS.TRIPS.GET_SHARE_TRIP_INFORMATION.replace(":linkId", linkId),
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

export const getAllUserTrips = async () => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(ENDPOINTS.TRIPS.GET_USER_TRIPS, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};
