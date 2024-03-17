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
import { getFormattedDateRange } from "@/utils/date";

const TripDetails = () => {
  const [tripDetails, setTripDetails] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
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

      console.log(data);


      const tripDetailsByDay = data.tripDetails.reduce(
        (acc: any, detail: any) => {
          const startDate = new Date(detail.startTime)
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

      setTripDetails(tripDetails);
    };

    tryFetchingTripDetails();
  }, []);

  useEffect(() => {
    console.log(tripDetails);
  }, [tripDetails]);

  return isLoading && !tripDetails ? (
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
          <Button>Add New Plan</Button>
        </div>
        <Separator className="my-4" />
      </div>
      <div className="events-container">
        <TripDetailsAccordion tripDetails={tripDetails.data} />
      </div>
    </div>
  );
};

export default TripDetails;
