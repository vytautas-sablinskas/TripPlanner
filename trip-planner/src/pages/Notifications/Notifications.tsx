import { useEffect, useState } from "react";
import { NotificationList } from "./NotificationList";
import "./styles/notifications.css";
import { checkTokenValidity } from "@/utils/jwtUtils";
import { refreshAccessToken } from "@/services/AuthenticationService";
import { useUser } from "@/providers/user-provider/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Paths from "@/routes/Paths";
import { getNotifications, markNotificationsAsRead } from "@/services/NotificationService";

const Notifications = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut, changeHasNotifications } = useUser();

    useEffect(() => {
        const validateAccessToken = async () => {
            const accessToken = localStorage.getItem("accessToken");

            if (!checkTokenValidity(accessToken || "")) {
                const result = await refreshAccessToken();
                if (!result.success) {
                    changeUserInformationToLoggedOut();
                    navigate(Paths.LOGIN);
                    return false;
                }

                changeUserInformationToLoggedIn(
                    result.data.accessToken,
                    result.data.refreshToken,
                    result.data.id
                );
            }

            return true;
        }

        const tryFetchingNotifications = async () => {
            setIsLoading(true);
            const isValid = await validateAccessToken();
            if (!isValid) {
                return;
            }

            const response = await getNotifications();
            if (!response.ok) {
                toast.error("Unexpected error. Try again later", {
                    position: "top-center",
                });
            }

            const data = await response.json();
            setNotifications(data);
            setIsLoading(false);
        }

        const tryMakingNotificationsAsRead = async () => {
            await validateAccessToken();
            const response = await markNotificationsAsRead();
            if (response.ok) {
                changeHasNotifications(false);
            }
        }

        tryFetchingNotifications();
        tryMakingNotificationsAsRead();
    }, []);

    const onStatusChange = (index : any) => {
        const dataCopy = [...notifications];

        dataCopy.splice(index, 1);
        setNotifications(dataCopy);
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="notifications-main-container">
            <h1 className="my-4 font-bold text-4xl">Notifications</h1>
            <NotificationList data={notifications} onStatusChange={onStatusChange}/>
        </div>
    )
}

export default Notifications;