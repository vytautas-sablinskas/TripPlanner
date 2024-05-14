import ENDPOINTS from "./Endpoints";

export const getNotifications = async () => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(ENDPOINTS.NOTIFICATIONS.GET_USER_NOTIFICATIONS, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const markNotificationsAsRead = async () => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(
    ENDPOINTS.NOTIFICATIONS.MARK_NOTIFICATIONS_AS_READ,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};

export const changeInvitationStatus = async (
  notificationId: any,
  status: any
) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(
    ENDPOINTS.NOTIFICATIONS.CHANGE_INVITATION_STATUS.replace(
      ":notificationId",
      notificationId
    ),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(status),
    }
  );

  return response;
};
