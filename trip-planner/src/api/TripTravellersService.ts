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

export const inviteTripTravellers = async (tripId : any, inviteTripTravellersDto : any) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(ENDPOINTS.TRIP_TRAVELLERS.ADD_TRIP_TRAVELLERS
        .replace(":tripId", tripId),
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(inviteTripTravellersDto)
        });

    return response;
}

export const deleteTripTraveller = async (tripId : any, email : any) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(ENDPOINTS.TRIP_TRAVELLERS.DELETE_TRIP_TRAVELLER
        .replace(":tripId", tripId)
        .replace(":email", email),
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

    return response;
}

export const editTripTraveller = async (tripId : any, travellerId : any, permissions : any) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(ENDPOINTS.TRIP_TRAVELLERS.EDIT_TRIP_TRAVELLER
        .replace(":tripId", tripId)
        .replace(":travellerId", travellerId),
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ permissions: Number(permissions) })
        });

    return response;
}