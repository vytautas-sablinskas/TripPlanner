import ENDPOINTS from "./Endpoints";

export const getUserProfile = async () => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(ENDPOINTS.PROFILE.GET_USER_PROFILE,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

    return response;
}

export const changePassword = async (values : any) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(ENDPOINTS.PROFILE.CHANGE_PASSWORD,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(values),
        });

    return response;
}

export const changeProfileInformation = async (values : any) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(ENDPOINTS.PROFILE.CHANGE_PROFILE_INFORMATION,
        {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: values,
        });

    return response;
}
