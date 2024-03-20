import { ArrowLeft, CircleX, Globe, MapPin, Pencil, Phone } from "lucide-react";
import "./styles/trip-detail-view.css";
import { useNavigate } from "react-router-dom";
import Paths from "@/routes/Paths";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { checkTokenValidity } from "@/utils/jwtUtils";
import { refreshAccessToken } from "@/api/AuthenticationService";
import { toast } from "sonner";
import { useState } from "react";
import { useUser } from "@/providers/user-provider/UserContext";
import { deleteTripDetail } from "@/api/TripDetailService";
import DeleteDialog from "@/components/Extra/DeleteDialog";

const TripDetailView = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut } = useUser();


  const getTripId = () => {
    const path = location.pathname.split("/");
    return path[path.length - 3];
  };

  const getTripDetailId = () => {
    const path = location.pathname.split("/");
    return path[path.length - 1];
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

    const response = await deleteTripDetail(getTripDetailId());
    if (!response || !response.ok) {
      toast.error("Unexpected error. Try again later", {
        position: "top-center",
      });
    }
    
    toast.success("Plan deleted successfully", { position: "top-center" });
    navigate(Paths.TRIP_DETAILS.replace(":id", getTripId()));
    setIsLoading(false);
  };

  return (
    <div className="trip-view-main-container">
      <span
        className="back-to-trip-summary"
        onClick={() => navigate(Paths.TRIP_DETAILS.replace(":id", getTripId()))}
      >
        <ArrowLeft className="mr-2" />
        <p>Back To Trip Summary</p>
      </span>
      <span className="trip-first-row">
        <h1 className="trip-name-title">Plan Name</h1>
        <span>
            <Button className="mr-3" variant="ghost" onClick={() => navigate(Paths.TRIP_DETAILS_EDIT.replace(":tripId", getTripId()).replace(":planId", getTripDetailId()))}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Plan
            </Button>
            <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(true)}>
                <CircleX className="mr-2 h-4 w-4" />
                Delete Plan 
            </Button>
            <DeleteDialog
                open={isDeleteDialogOpen}
                title="Delete Plan"
                description="Are you sure you want to delete this plan? This will permanently delete this plan and its contents. You and all trip participants will not be able to access the plan or any documents related to this plan anymore."
                dialogButtonText="Delete Plan"
                onDelete={handleDelete}
                isLoading={isLoading}
                onClose={() => setIsDeleteDialogOpen(false)}
                setOpen={setIsDeleteDialogOpen}
            />
        </span>
      </span>      
      <Card className="trip-detail-view-information-container">
        <CardContent>
          <h2 className="information-container-title">Plan Information</h2>
          <div className="trip-detail-view-time-container">
            <div className="flex flex-col">
              <p className="font-medium text-lg">Starts Sat, Mar 9, 2024</p>
              <p className="font-bold text-xl">11:59 AM GMT+2</p>
            </div>
            <div className="ml-32">
              <p className="font-medium text-lg">Ends Mon, Mar 11, 2024</p>
              <p className="font-bold text-xl">7:59 PM GMT+2</p>
            </div>
          </div>
          <div className="activity-addresses">
            <a href="https://www.google.com/maps/search/?api=1&query=Kings+College+London,+Stamford+St,+London+SE1+9NQ,+UK" target="_blank">
                <MapPin className="w-4 h-4 mr-2"/>
                Kings College London, Stamford St, London SE1 9NQ, UK
            </a>
            <a href="tel:+442078365454">
                <Phone className="w-4 h-4 mr-2"/>
                020 7836 5454
            </a>
            <a href="https://www.kcl.ac.uk/visit/franklin-wilkins-building" target="_blank">
                <Globe className="w-4 h-4 mr-2"/>
                https://www.kcl.ac.uk/visit/franklin-wilkins-building
            </a>
          </div>
          <div className="notes">
            <p className="mb-5">"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
          </div>
        </CardContent>
      </Card>
      <Card className="trip-detail-view-documents"></Card>
    </div>
  );
};

export default TripDetailView;
