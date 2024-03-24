import React, { useContext } from 'react';

const UserContext = React.createContext({
    isAuthenticated: false,
    role: 'none',
    hasNotifications: false,
    changeUserInformationToLoggedIn: (_newAccessToken: string, _newRefreshToken: string) => { },
    changeUserInformationToLoggedOut: () => { },
    changeHasNotifications: (_hasNotifications: boolean) => { }
});

export const useUser = () => {
    return useContext(UserContext);
}

export default UserContext;