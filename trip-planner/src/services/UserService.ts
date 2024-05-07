import ENDPOINTS from "./Endpoints";

export const getUserInformation = async () => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(ENDPOINTS.USER.GET_INFORMATION,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

    return response;
}