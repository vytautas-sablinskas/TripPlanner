import ENDPOINTS from "./Endpoints";

export const addTripDocument = async (tripId: any, tripDetailId: any, data : any) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(ENDPOINTS.TRIP_DOCUMENTS.ADD_NEW_DOCUMENT.replace(':tripId', tripId).replace(':tripDetailId', tripDetailId),
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: data
        });

    return response
};