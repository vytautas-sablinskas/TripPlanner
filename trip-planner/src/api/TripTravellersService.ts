import ENDPOINTS from "./Endpoints";

export const getTripTravellers = async (tripId : any) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(ENDPOINTS.TRIP_TRAVELLERS.GET_ALL_TRIP_TRAVELLERS
        .replace(":tripId", tripId),
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

    return response;
}