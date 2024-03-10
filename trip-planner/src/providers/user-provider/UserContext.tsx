import React, { useContext } from 'react';

const UserContext = React.createContext({
    isAuthenticated: false,
    role: 'none',
    changeUserInformationToLoggedIn: (_newAccessToken: string, _newRefreshToken: string) => { },
    changeUserInformationToLoggedOut: () => { },
});

export const useUser = () => {
    return useContext(UserContext);
}

export default UserContext;