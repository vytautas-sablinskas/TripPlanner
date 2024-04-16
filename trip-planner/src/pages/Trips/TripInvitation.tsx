import { useUser } from "@/providers/user-provider/UserContext";
import Paths from "@/routes/Paths";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TripInvitation = () => {
    const { isAuthenticated } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate(Paths.HOME);
            return;
        }

        navigate(Paths.NOTIFICATIONS);
    })

    return null;
}

export default TripInvitation;