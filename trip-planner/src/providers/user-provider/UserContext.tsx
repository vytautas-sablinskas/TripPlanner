import React, { useContext } from "react";

const UserContext = React.createContext({
  isAuthenticated: false,
  role: "none",
  hasNotifications: false,
  id: "",
  changeUserInformationToLoggedIn: (
    _newAccessToken: string,
    _newRefreshToken: string,
    _id: string
  ) => {},
  changeUserInformationToLoggedOut: () => {},
  changeHasNotifications: (_hasNotifications: boolean) => {},
});

export const useUser = () => {
  return useContext(UserContext);
};

export default UserContext;
