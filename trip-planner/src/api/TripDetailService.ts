import ENDPOINTS from "./Endpoints";

export const getTripDetails = async (tripId : any) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(ENDPOINTS.TRIP_DETAILS.GET_ALL_TRIP_DETAILS
        .replace(":id", tripId),
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

    return response;
}