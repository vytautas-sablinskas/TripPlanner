import ENDPOINTS from "./Endpoints";

export const addTripDocument = async (
  tripId: any,
  tripDetailId: any,
  data: any
) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(
    ENDPOINTS.TRIP_DOCUMENTS.ADD_NEW_DOCUMENT.replace(
      ":tripId",
      tripId
    ).replace(":tripDetailId", tripDetailId),
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    }
  );

  return response;
};

export const editTripDocument = async (
    tripId: any,
    tripDetailId: any,
    documentId: any,
    data: any
  ) => {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(
      ENDPOINTS.TRIP_DOCUMENTS.EDIT_DOCUMENT.replace(":tripId", tripId)
      .replace(":tripDetailId", tripDetailId)
      .replace(":documentId", documentId),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );
  
    return response;
  };

export const deleteTripDocument = async (
  tripId: any,
  tripDetailId: any,
  documentId: any
) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(
    ENDPOINTS.TRIP_DOCUMENTS.DELETE_DOCUMENT.replace(":tripId", tripId)
      .replace(":tripDetailId", tripDetailId)
      .replace(":documentId", documentId),
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};
