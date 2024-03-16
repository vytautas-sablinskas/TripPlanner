import { Button } from "@/components/ui/button";
import "./styles/trip-details.css";
import { Separator } from "@/components/ui/separator";
import TripDetailsAccordion from "./TripDetailsAccordion";
import { useEffect, useState } from "react";
import { checkTokenValidity } from "@/utils/jwtUtils";
import { refreshAccessToken } from "@/api/AuthenticationService";
import { useUser } from "@/providers/user-provider/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Paths from "@/routes/Paths";
import { getTripDetails } from "@/api/TripDetailService";

const TripDetails = () => {
  const [tripDetails, setTripDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut } =
    useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const tryFetchingTripDetails = async () => {
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

      const paths = location.pathname.split("/");

      const response = await getTripDetails(paths[paths.length - 1]);
        if (!response || !response.ok) {
            toast.error("Unexpected error. Try again later", {
                position: "top-center",
            });
            return;
        }

        const data = await response.json();
        setTripDetails(data);
    };

    tryFetchingTripDetails();
  }, []);

  useEffect(() => {
    console.log(tripDetails);
  }, [tripDetails]);

  return isLoading ? (
    <div>Loading</div>
  ) : (
    <div className="main-container">
      <div className="trip-information-container">
        <div className="trip-information-content">
          <h1 className="trip-information-title">Trip To Paris</h1>
          <p>Paris, France</p>
          <p className="trip-information-time">Mar 16 - Mar 19, 2024</p>
        </div>
        <img
          src="https://via.placeholder.com/232"
          height={232}
          width={232}
          alt="trip"
          className="image trip-information-image"
        />
      </div>
      <div className="trip-details-main-container">
        <div className="trip-details-information">
          <p className="trip-details-itinerary">Itinerary</p>
          <Button>Add New Plan</Button>
        </div>
        <Separator className="my-4" />
      </div>
      <div className="events-container">
        <TripDetailsAccordion />
      </div>
    </div>
  );
};

export default TripDetails;
