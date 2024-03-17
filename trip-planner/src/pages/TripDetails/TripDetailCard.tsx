import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import "./styles/trip-detail-card.css";
import { useLocation, useNavigate } from "react-router-dom";
import Paths from "@/routes/Paths";
import { DeleteDialog } from "@/components/Extra/DeleteDialog";
import { checkTokenValidity } from "@/utils/jwtUtils";
import { refreshAccessToken } from "@/api/AuthenticationService";
import { toast } from "sonner";
import { useUser } from "@/providers/user-provider/UserContext";
import { deleteTripDetail } from "@/api/TripDetailService";
import { useState } from "react";

const TripDetailCard = ({ detail, onDelete }: any) => {
  const startTime = detail.startTime ? new Date(detail.startTime + "Z") : null;
  const navigate = useNavigate();
  const location = useLocation();
  const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut } =
    useUser();
  const [isLoading, setIsLoading] = useState(false);

  const getTripId = () => {
    return location.pathname.split("/").pop() || "";
  };

  function formatTime(time: any) {
    const options = { hour: "numeric", minute: "2-digit", hour12: true };
    const formattedTime = time.toLocaleTimeString("en-US", options);
    return formattedTime;
  }

  function formatTimezoneOffset() {
    const timezoneOffset = new Date().getTimezoneOffset();
    const offsetSign = timezoneOffset < 0 ? "+" : "-";
    const offsetHours = Math.abs(Math.floor(timezoneOffset / 60));
    return `GMT ${offsetSign}${offsetHours}`;
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
        result.data.refreshToken
      );
    }

    const response = await deleteTripDetail(detail.id);
    if (!response || !response.ok) {
      toast.error("Unexpected error. Try again later", {
        position: "top-center",
      });
    }

    onDelete();
  };

  return (
    <Card>
      <CardContent className="w-full min-h-[125px] min-w-[300px] p-[24px] pr-0 flex justify-between sm:p-2">
        <div>
          <p className="">{startTime && formatTime(startTime)}</p>
          <p className="">{formatTimezoneOffset()}</p>
        </div>
        <span className="event-image-container">
          <Separator orientation="vertical" className="mx-5" />
          <img
            src="https://via.placeholder.com/40"
            alt="activity"
            className="activity-image"
            height={40}
            width={40}
          />
          <Separator orientation="vertical" className="mx-5" />
        </span>
        <div className="event-container-information">
          <p className="event-name">{detail.name}</p>
          <p className="text-xs">{detail.address}</p>
        </div>
        <div className="separator-div">
          <Separator orientation="vertical" className="mx-5" />
        </div>
        <div className="content-buttons">
          <Button
            onClick={() =>
              navigate(
                Paths.TRIP_DETAILS_EDIT.replace(":tripId", getTripId()).replace(
                  ":planId",
                  detail.id
                )
              )
            }
          >
            Edit Plan
          </Button>
          <DeleteDialog
            buttonText="Delete Plan"
            title="Delete Plan"
            description="Are you sure you want to delete this plan? This will permanently delete the plan."
            dialogButtonText="Delete"
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TripDetailCard;
