import ENDPOINTS from "./Endpoints";

export const addTrip = async (title: string, description: string, destinationCountry: string, photoUri: string, startDate: string, endDate: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(ENDPOINTS.TRIPS.CREATE_TRIP,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description, destinationCountry, photoUri, startDate, endDate })
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