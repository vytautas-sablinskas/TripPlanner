"use client";

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import UserContext from './user-context';

const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState('none');
    const [accessToken, setAccessToken] = useState('none');
    const [refreshToken, setRefreshToken] = useState('none');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedIsAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
            setIsAuthenticated(storedIsAuthenticated);
            const storedRole = localStorage.getItem('role') ?? 'none';
            setRole(storedRole);
            const storedAccessToken = localStorage.getItem('accessToken') ?? 'none';
            setAccessToken(storedAccessToken);
            const storedRefreshToken = localStorage.getItem('refreshToken') ?? 'none';
            setRefreshToken(storedRefreshToken);
        }
    }, []);

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

    const changeUserInformationToLoggedIn = useCallback((newAccessToken : string, newRefreshToken : string) => {
        const payload = decodeJWT(newAccessToken);
        const userRole = payload ? payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] : 'none';

        setIsAuthenticated(true);
        setRole(userRole);
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('role', userRole);
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
    }, []);

    const changeUserInformationToLoggedOut = useCallback(() => {
        setIsAuthenticated(false);
        setRole('none');
        setAccessToken('none');
        setRefreshToken('none');

        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('role');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }, []);

    const contextValue = useMemo(() => ({
        isAuthenticated,
        role,
        accessToken,
        refreshToken,
        changeUserInformationToLoggedIn: (accessToken : string, refreshToken : string) => changeUserInformationToLoggedIn(accessToken, refreshToken),
        changeUserInformationToLoggedOut,
        decodeJWT
    }), [isAuthenticated, role, accessToken, refreshToken, changeUserInformationToLoggedIn, changeUserInformationToLoggedOut]);

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContextProvider;