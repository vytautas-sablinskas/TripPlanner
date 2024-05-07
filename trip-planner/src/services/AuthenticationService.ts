import ENDPOINTS from "./Endpoints";

export const login = async (props : any) => {
    try {
        const response = await fetch(ENDPOINTS.AUTHENTICATION.LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: props.email, password: props.password })
        });
    
        return response;
    } catch(error) {
        return error;
    }
};

export const register = async (props : any) => {
    try {
        const response = await fetch(ENDPOINTS.AUTHENTICATION.REGISTER, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: props.name, surname: props.surname, email: props.email, password: props.password })
        });

        return response;
    } catch(error) {
        return error;
    }
};

export const logout = async (refreshToken : string) => {
    try {
        await fetch(ENDPOINTS.AUTHENTICATION.LOGOUT, {
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
        const response = await fetch(ENDPOINTS.AUTHENTICATION.REFRESH_TOKEN, { 
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