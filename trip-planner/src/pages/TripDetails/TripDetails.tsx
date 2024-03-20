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
import { getFormattedDateRange, getLocalDate } from "@/utils/date";
import { CirclePlus } from "lucide-react";

const TripDetails = () => {
  const [tripDetails, setTripDetails] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut } =
    useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const getTripId = () => {
    const paths = location.pathname.split("/");
    return paths[paths.length - 1];
  }

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

    const response = await getTripDetails(getTripId());
    if (!response || !response.ok) {
      toast.error("Unexpected error. Try again later", {
        position: "top-center",
      });
      return;
    }

    const data = await response.json();

    const tripDetailsByDay = data.tripDetails.reduce(
      (acc: any, detail: any) => {
        const startDate = getLocalDate(detail.startTime + "Z")
          .toISOString()
          .split("T")[0];
        if (!acc[startDate]) {
          acc[startDate] = [];
        }
        acc[startDate].push(detail);
        return acc;
      },
      {}
    );

    const tripDetails = {
      tripInformation: data.tripInformation,
      data: tripDetailsByDay,
    };

    setIsLoading(false);
    setTripDetails(tripDetails);
  };

  useEffect(() => {
    tryFetchingTripDetails();
  }, []);

  const handleDelete = async () => {
    await tryFetchingTripDetails();
  }

  return isLoading ? (
    <div>Loading</div>
  ) : (
    <div className="main-container">
      <div className="trip-information-container">
        <div className="trip-information-content">
          <h1 className="trip-information-title">
            {tripDetails.tripInformation.title}
          </h1>
          <p>{tripDetails?.tripInformation.destinationCountry}</p>
          <p className="trip-information-time">
            {getFormattedDateRange(
              tripDetails.tripInformation.startDate,
              tripDetails.tripInformation.endDate
            )}
          </p>
        </div>
        <img
          src={tripDetails.tripInformation.photoUri}
          height={232}
          width={232}
          alt="trip"
          className="image trip-information-image"
        />
      </div>
      <div className="trip-details-main-container">
        <div className="trip-details-information">
          <p className="trip-details-itinerary">Itinerary</p>
          <Button
            onClick={() =>
              navigate(Paths.TRIP_DETAILS_CREATE.replace(":id", getTripId()))
            }
            className="rounded-xl"
            variant="ghost"
          >
            <CirclePlus className="mr-2"/>
            Add New Plan
          </Button>
        </div>
        <Separator className="my-4" />
      </div>
      <div className="events-container">
        <TripDetailsAccordion
          tripDetails={tripDetails.data}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default TripDetails;
