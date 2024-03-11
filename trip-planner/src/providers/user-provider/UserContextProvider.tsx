import React, { useState, useCallback, useMemo, useEffect } from 'react';
import UserContext from './UserContext';

const UserContextProvider = ({ children }: any) => {
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');
    const [role, setRole] = useState(localStorage.getItem('role') || 'none');

    function decodeJWT(token : string) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(atob(base64));
            return payload;
        } catch (error) {
            console.error("Failed to decode JWT:", error);
            return null;
        }
    }

    const changeUserInformationToLoggedIn = useCallback((newAccessToken: string, newRefreshToken: string) => {
        const payload = decodeJWT(newAccessToken);
        const userRole = payload ? payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] : 'none';

        setIsAuthenticated(true);
        setRole(userRole);

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('role', userRole);
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
    }, []);

    const changeUserInformationToLoggedOut = useCallback(() => {
        setIsAuthenticated(false);
        setRole('none');

        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('role');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }, []);

    const contextValue = useMemo(() => ({
        isAuthenticated,
        role,
        changeUserInformationToLoggedIn,
        changeUserInformationToLoggedOut
    }), [isAuthenticated, role, changeUserInformationToLoggedIn, changeUserInformationToLoggedOut]);

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContextProvider;