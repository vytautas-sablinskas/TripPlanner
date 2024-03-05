import { ENDPOINT_PATHS } from "../../ENDPOINT_PATHS";

export type LoginData = {
    email: string;
    password: string;
};

export const login = async (formValues : LoginData) => {
    const response = await fetch(ENDPOINT_PATHS.LOGIN, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formValues.email, password: formValues.password })
    });

    return response;
};

export const register = async (firstName : string, lastName : string, email : string, password : string) => {
    const response = await fetch(ENDPOINT_PATHS.REGISTER, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password })
    });

    return response;
};

export const logout = async (refreshToken : string) => {
    try {
        await fetch(ENDPOINT_PATHS.LOGOUT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: refreshToken })
        });
    } catch {
    }
};

export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
        const response = await fetch(ENDPOINT_PATHS.REFRESH_TOKEN, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: refreshToken })
        });

        if (response.status === 400) {
            return { success: false, reason: 'Failed refreshing token' };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) { 
        return { success: false, reason: 'Network or server error' };
    }
};