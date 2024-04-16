import { useEffect, useState } from "react";
import { NotificationList } from "./NotificationList";
import "./styles/notifications.css";
import { checkTokenValidity } from "@/utils/jwtUtils";
import { refreshAccessToken } from "@/api/AuthenticationService";
import { useUser } from "@/providers/user-provider/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Paths from "@/routes/Paths";
import { getNotifications, markNotificationsAsRead } from "@/api/NotificationService";

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
                    toast.error("Session has expired. Login again!", {
                    position: "top-center",
                    });

                    changeUserInformationToLoggedOut();
                    navigate(Paths.LOGIN);
                    return;
                }

                changeUserInformationToLoggedIn(
                    result.data.accessToken,
                    result.data.refreshToken,
                    result.data.id
                );
            }
        }

        const tryFetchingNotifications = async () => {
            await validateAccessToken();
            setIsLoading(true);

            const response = await getNotifications();
            if (!response.ok) {
                toast.error("Unexpected error. Try again later", {
                    position: "top-center",
                });
            }

            const data = await response.json();
            console.log(data);
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

    return (
        <div className="notifications-main-container">
            <h1 className="my-4 font-bold text-4xl">Notifications</h1>
            <NotificationList data={notifications} onStatusChange={onStatusChange}/>
        </div>
    )
}

export default Notifications;