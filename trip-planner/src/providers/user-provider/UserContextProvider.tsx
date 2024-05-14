import { useState, useCallback, useMemo } from "react";
import UserContext from "./UserContext";

const UserContextProvider = ({ children }: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [role, setRole] = useState(localStorage.getItem("role") || "none");
  const [hasNotifications, setHasNotifications] = useState(
    localStorage.getItem("hasNotifications") === "true"
  );
  const [id, setId] = useState(localStorage.getItem("id") || "");

  function decodeJWT(token: string) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(base64));
      return payload;
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      return null;
    }
  }

  const changeUserInformationToLoggedIn = useCallback(
    (newAccessToken: string, newRefreshToken: string, userId: string) => {
      const payload = decodeJWT(newAccessToken);
      const userRole = payload
        ? payload[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ]
        : "none";

      setIsAuthenticated(true);
      setRole(userRole);
      setHasNotifications(false);
      setId(userId);

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("role", userRole);
      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      localStorage.setItem("hasNotifications", "false");
      localStorage.setItem("id", userId);
    },
    []
  );

  const changeUserInformationToLoggedOut = useCallback(() => {
    setIsAuthenticated(false);
    setRole("none");
    setId("");
    setHasNotifications(false);

    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("role");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("hasNotifications");
    localStorage.removeItem("id");
  }, []);

  const changeHasNotifications = useCallback((hasNotifications: boolean) => {
    setHasNotifications(hasNotifications);
    localStorage.setItem("hasNotifications", String(hasNotifications));
  }, []);

  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      role,
      id,
      hasNotifications,
      changeUserInformationToLoggedIn,
      changeUserInformationToLoggedOut,
      changeHasNotifications,
    }),
    [
      isAuthenticated,
      role,
      hasNotifications,
      id,
      changeUserInformationToLoggedIn,
      changeUserInformationToLoggedOut,
      changeHasNotifications,
    ]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;
