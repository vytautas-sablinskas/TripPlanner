import React, { useContext } from 'react';

const UserContext = React.createContext({
    isAuthenticated: false,
    role: 'none',
    changeUserInformationToLoggedIn: (accessToken : string, refreshToken : string) => {},
    changeUserInformationToLoggedOut: () => {},
    accessToken: '',
    refreshToken: '',
});

export const useUser = () => {
    return useContext(UserContext);
}

export default UserContext;