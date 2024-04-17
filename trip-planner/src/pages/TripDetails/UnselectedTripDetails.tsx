import { useEffect, useState } from "react";
import "../Notifications/styles/notifications.css";
import { checkTokenValidity } from "@/utils/jwtUtils";
import { refreshAccessToken } from "@/api/AuthenticationService";
import { useUser } from "@/providers/user-provider/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Paths from "@/routes/Paths";
import { UnselectedTripDetailsList } from "./UnselectedTripDetailsList";
import { getUnselectedTrips } from "@/api/TripDetailService";
import { getAllUserTrips } from "@/api/TripService";

const UnselectedTripDetails = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut, isAuthenticated } = useUser();
    const [availableTrips, setAvailableTrips] = useState<any>([]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate(Paths.LOGIN);
        }

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

        const tryFetchingPlans = async () => {
            await validateAccessToken();
            setIsLoading(true);

            const response = await getUnselectedTrips();
            const plansResponse = await getAllUserTrips();
            if (!response.ok || !plansResponse.ok) {
                toast.error("Unexpected error. Try again later", {
                    position: "top-center",
                });

                return;
            }

            const data = await response.json();
            const plansData = await plansResponse.json();

            console.log(plansData);
            setPlans(data);
            setAvailableTrips(plansData);
            setIsLoading(false);
        }

        tryFetchingPlans();
    }, []);

    const onPlanChange = (index : any) => {
        const dataCopy = [...plans];

        dataCopy.splice(index, 1);
        setPlans(dataCopy);
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="notifications-main-container">
            <UnselectedTripDetailsList data={plans} availableTrips={availableTrips} onPlanChange={onPlanChange}/>
        </div>
    )
}

export default UnselectedTripDetails;