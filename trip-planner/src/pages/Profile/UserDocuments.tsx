import { useEffect, useState } from "react";
import "../Notifications/styles/notifications.css";
import { checkTokenValidity } from "@/utils/jwtUtils";
import { refreshAccessToken } from "@/services/AuthenticationService";
import { useUser } from "@/providers/user-provider/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Paths from "@/routes/Paths";
import { UserDocumentsList } from "./UserDocumentsList";
import { getUserDocuments } from "@/services/TripDocumentService";

const UserDocuments = () => {
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut, isAuthenticated } = useUser();

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

        const tryFetchingDocuments = async () => {
            await validateAccessToken();
            setIsLoading(true);

            const response = await getUserDocuments();
            if (!response.ok) {
                toast.error("Unexpected error. Try again later", {
                    position: "top-center",
                });
            }

            const data = await response.json();
            setDocuments(data);
            setIsLoading(false);
        }
        
        if (!isAuthenticated) {
            navigate(Paths.LOGIN);
            return;
        }

        tryFetchingDocuments();
    }, []);

    const onStatusChange = (index : any) => {
        const dataCopy = [...documents];

        dataCopy.splice(index, 1);
        setDocuments(dataCopy);
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="notifications-main-container">
            <h1 className="my-4 font-bold text-4xl">Your Documents</h1>
            <UserDocumentsList data={documents} onStatusChange={onStatusChange}/>
        </div>
    )
}

export default UserDocuments;