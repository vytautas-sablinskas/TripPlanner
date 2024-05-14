import { refreshAccessToken } from "@/services/AuthenticationService";
import { getTripDetails } from "@/services/TripDetailService";
import { Card } from "@/components/ui/card";
import { useUser } from "@/providers/user-provider/UserContext";
import Paths from "@/routes/Paths";
import {
  formatDateToString,
  getFormattedDateRange,
  getLocalDate,
} from "@/utils/date";
import { checkTokenValidity } from "@/utils/jwtUtils";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import TripDetailCard from "./TripDetailCard";
import "./styles/export-information-trip.css";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";

const ExportInformationTrip = () => {
  const [isLoading, setIsLoading] = useState(true);
  const {
    changeUserInformationToLoggedIn,
    changeUserInformationToLoggedOut,
    isAuthenticated,
  } = useUser();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<any>([]);
  const [days, setDays] = useState<any>([]);
  const [sortedDays, setSortedDays] = useState<any>([]);
  const [tripInformation, setTripInformation] = useState<any>({});
  const [isPrinting, setIsPrinting] = useState(false);

  const pdfComponent = useRef(null);

  const getTripId = () => {
    const paths = location.pathname.split("/");
    return paths[paths.length - 2];
  };

  useEffect(() => {
    const fetchTripDetails = async () => {
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
          result.data.refreshToken,
          result.data.id
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

      const days = Object.keys(tripDetailsByDay).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );
      const sortedDays: { [key: string]: any[] } = days.reduce((acc, day) => {
        const sortedDetails = tripDetailsByDay[day].sort(
          (a: any, b: any) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
        return { ...acc, [day]: sortedDetails };
      }, {});
      setDays(days);
      setSortedDays(sortedDays);
      setTrips(tripDetailsByDay);
      setTripInformation(data.tripInformation);
      setIsLoading(false);
    };

    if (!isAuthenticated) {
      navigate(Paths.LOGIN);
      return;
    }

    fetchTripDetails();
  }, []);

  const onGeneratePdf = () => {
    setIsPrinting(true);
    generatePDF();
  };

  const generatePDF = useReactToPrint({
    content: () => pdfComponent.current,
    onAfterPrint: () => {
      setIsPrinting(false);
    },
  });

  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <div className="w-full">
      <div className="print-button-container">
        <Button onClick={() => onGeneratePdf()}>
          <Printer className="h-4 w-4 mr-2" />
          Print Trip
        </Button>
      </div>
      <div className="export-information-main-container" ref={pdfComponent}>
        <div className="trip-information-container !w-full">
          <div className="trip-information-content !p-0 !w-8/10">
            <h1 className="trip-information-title">{tripInformation.title}</h1>
            <p>{tripInformation.destinationCountry}</p>
            <p className="trip-information-time">
              {getFormattedDateRange(
                tripInformation.startDate,
                tripInformation.endDate
              )}
            </p>
          </div>
          <img
            src={tripInformation.photoUri}
            height={232}
            width={232}
            alt="trip"
            className="image trip-information-image !m-0"
          />
        </div>

        {days.map((day: any) => (
          <div key={day}>
            <p className="mt-8 text-2xl font-bold">{formatDateToString(day)}</p>
            <div className="card-container">
              {sortedDays[day].map((detail: any, detailIndex: any) => (
                <TripDetailCard
                  key={detailIndex}
                  detail={detail}
                  isButtonsOff
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExportInformationTrip;
