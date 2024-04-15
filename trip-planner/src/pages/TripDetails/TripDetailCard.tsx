import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import "./styles/trip-detail-card.css";
import { useLocation, useNavigate } from "react-router-dom";
import Paths from "@/routes/Paths";
import { DeleteDialogButton } from "@/components/Extra/DeleteDialogButton";
import { checkTokenValidity } from "@/utils/jwtUtils";
import { refreshAccessToken } from "@/api/AuthenticationService";
import { toast } from "sonner";
import { useUser } from "@/providers/user-provider/UserContext";
import { deleteTripDetail } from "@/api/TripDetailService";
import { useState } from "react";
import {
  Backpack,
  BedDouble,
  CircleHelp,
  Pencil,
  PersonStanding,
  ShoppingCart,
  Utensils,
} from "lucide-react";
import { DateTimeFormatOptions } from "luxon";

const TripDetailCard = ({ detail, onDelete, isButtonsOff = false }: any) => {
  const startTime = detail.startTime ? new Date(detail.startTime) : null;
  const navigate = useNavigate();
  const location = useLocation();
  const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut } =
    useUser();
  const [isLoading, setIsLoading] = useState(false);

  const getTripId = () => {
    return location.pathname.split("/").pop() || "";
  };

  function formatTime(time: any) {
    const options : DateTimeFormatOptions = { hour: "numeric", minute: "2-digit", hour12: true };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    return formatter.format(time);
  }

  const handleDelete = async () => {
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

    const response = await deleteTripDetail(detail.id);
    if (!response || !response.ok) {
      toast.error("Unexpected error. Try again later", {
        position: "top-center",
      });
      setIsLoading(false);
      return;
    }

    await onDelete(detail.id);
    setIsLoading(false);
  };

  const getActivityImage = (type: any) => {
    console.log(type);
    switch (type) {
      case 0:
        return <PersonStanding className="w-4 h-4" />;
      case 1:
        return <Backpack className="w-4 h-4" />;
      case 2:
        return <Utensils className="w-4 h-4" />;
      case 3:
        return <BedDouble className="w-4 h-4" />;
      case 4:
        return <ShoppingCart className="w-4 h-4" />;
      case 5:
        return <CircleHelp className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent
        className={`w-full min-w-[300px] p-[24px] pr-0 flex justify-between sm:p-2`}
      >
        <div>
          <p className="">{startTime && formatTime(startTime)}</p>
        </div>
        <span className="event-image-container justify-center">
          <Separator orientation="vertical" className="mx-5" />
          <div className="w-[40px] h-[40px] rounded-full bg-gray-300 flex justify-center items-center">
            {getActivityImage(detail.eventType)}
          </div>
          <Separator orientation="vertical" className="mx-5" />
        </span>
        <div className="event-container-information">
          {!isButtonsOff ? (
            <p
              className="event-name"
              onClick={() =>
                navigate(
                  Paths.TRIP_DETAILS_VIEW.replace(
                    ":tripId",
                    getTripId()
                  ).replace(":planId", detail.id)
                )
              }
            >
              {detail.name}
            </p>
          ) : (
            <p className="text-lg font-semibold">{detail.name}</p>
          )}
          <p className="text-xs">{detail.address}</p>
        </div>
        {!isButtonsOff && (
          <div className="separator-div">
            <Separator orientation="vertical" className="mx-5" />
          </div>
        )}
        {!isButtonsOff && (
          <div className="content-buttons">
            <Button
              onClick={() =>
                navigate(
                  Paths.TRIP_DETAILS_EDIT.replace(
                    ":tripId",
                    getTripId()
                  ).replace(":planId", detail.id)
                )
              }
              className="w-full py-0"
              variant="outline"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit Plan
            </Button>
            <DeleteDialogButton
              buttonText="Delete Plan"
              title="Delete Plan"
              description="Are you sure you want to delete this plan? This will permanently delete this plan and its contents. You and all trip participants will not be able to access the plan or any documents related to this plan anymore."
              dialogButtonText="Delete"
              onDelete={handleDelete}
              isLoading={isLoading}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TripDetailCard;
