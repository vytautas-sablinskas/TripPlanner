import ENDPOINTS from "./Endpoints";

export const addTrip = async (formData: FormData) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(ENDPOINTS.TRIPS.CREATE_TRIP,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

    return response
};

export const getTripsList = async (filter: any, page: any) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(ENDPOINTS.TRIPS.GET_TRIPS
        .replace(":filterName", filter)
        .replace(":page", page),
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

    return response;
}