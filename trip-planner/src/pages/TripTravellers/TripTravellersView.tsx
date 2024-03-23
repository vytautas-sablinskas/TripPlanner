import { useEffect, useState } from "react";
import { TripTravellerList } from "./TripTravellerList";
import "./styles/trip-travellers-view.css";
import { checkTokenValidity } from "@/utils/jwtUtils";
import { refreshAccessToken } from "@/api/AuthenticationService";
import { toast } from "sonner";
import { useUser } from "@/providers/user-provider/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import Paths from "@/routes/Paths";
import { getTripTravellers } from "@/api/TripTravellersService";

const TripTravellersView = () => {
    const [travellers, setTravellers] = useState([]);
    const [userPermissions, setUserPermissions] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    
    const getTripId = () => {
        const path = location.pathname.split("/");
        return path[path.length - 2];
    };

    useEffect(() => {
        const fetchTravellers = async () => {
            setIsLoading(true);
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
                    result.data.refreshToken
                );
            }

            const response = await getTripTravellers(getTripId());
            if (!response.ok) {
                toast.error("Unexpected error. Try again later", {
                    position: "top-center",
                });
                setIsLoading(false);
                return;
            }

            const data = await response.json();
            setUserPermissions(data.requesterPermissions);
            setTravellers(data.travellers);
            setIsLoading(false);
        }

        fetchTravellers();
    }, [])

    const ADMIN_PRIVELLEGES = 2
    if (!isLoading && userPermissions !== ADMIN_PRIVELLEGES) {
        navigate(Paths.HOME);
    }

    return (
        <div className="trip-travellers-view-main-container">
            <TripTravellerList data={travellers}/>
        </div>
    );
}

export default TripTravellersView;