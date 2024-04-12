import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import "../styles/trip-list.css";
import "./styles/trip-card.css";
import { getFormattedDateRange } from "@/utils/date";
import { useNavigate } from "react-router-dom";
import Paths from "@/routes/Paths";
import { checkTokenValidity } from "@/utils/jwtUtils";
import { refreshAccessToken } from "@/api/AuthenticationService";
import { toast } from "sonner";
import { useUser } from "@/providers/user-provider/UserContext";
import { deleteTrip } from "@/api/TripService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, CircleEllipsis, CircleX, File, Pencil, Printer, Users, Wallet } from "lucide-react";
import DeleteDialog from "@/components/Extra/DeleteDialog";

const TripCard = ({ trip, onDelete }: any) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut } =
    useUser();

  const handleDelete = async () => {
    const accessToken = localStorage.getItem("accessToken");
    setLoading(true);

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

    try {
      const response = await deleteTrip(trip.id);

      if (response.ok) {
        toast.success("Trip deleted successfully", { position: "top-center" });
      } else {
        toast.error("Unexpected error. Try again later", {
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error("Unexpected error. Try again later", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }

    onDelete();
  };

  const onDialogClose = () => {
    setIsMenuOpen(false);
    setIsDialogOpen(false);
  };

  return (
    <Card key={trip.id} className="main-card-container-wrapper">
      <CardContent className="trip-card-container" style={{ padding: 0 }}>
        <div className="trip-card-information-container">
          <div>
            <p
              className="trip-title"
              onClick={() =>
                navigate(Paths.TRIP_DETAILS.replace(":id", trip.id))
              }
            >
              {trip.title}
            </p>
            <p className="destination-text">{trip.destinationCountry}</p>
            <p className="date-range-text">
              {getFormattedDateRange(trip.startDate, trip.endDate)}
            </p>
            <div className="trip-card-buttons">
              <Button className="trip-card-button" variant="ghost" onClick={() => navigate(Paths.EDIT_TRIP.replace(":id", trip.id))}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit Trip Information</span>
              </Button>
              <DropdownMenu
                open={isMenuOpen}
                onOpenChange={(isOpen) => setIsMenuOpen(isOpen)}
                modal={false}
              >
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="trip-card-button">
                    <CircleEllipsis className="mr-2 h-4 w-4" />
                    More Options
                    <ChevronDown
                      className={`ml-2 w-4 h-4 transition-transform duration-200 ease-in-out ${isMenuOpen ? "rotate-180" : ""}`}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(Paths.TRIP_TRAVELLERS_VIEW.replace(":tripId", trip.id))}>
                    <Users className="mr-2 h-4 w-4" />
                    Manage Trip Participants
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(Paths.BUDGETS.replace(":tripId", trip.id))}>
                    <Wallet className="mr-2 h-4 w-4"/>
                    Manage Trip Budgets
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(Paths.EXPORT_TRIP.replace(":tripId", trip.id))}>
                    <Printer className="mr-2 h-4 w-4"/>
                    Print Trip
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    onClick={() => setIsDialogOpen(true)}
                    className="cursor-pointer"
                  >
                    <CircleX className="mr-2 h-4 w-4" />
                    Delete Trip
                  </DropdownMenuItem>
                  <DeleteDialog
                    title="Delete Trip"
                    description="Are you sure you want to delete this trip? This will permanently delete this trip and its contents. You and all trip participants will not be able to access the trip or any trip plans."
                    dialogButtonText="Delete"
                    onDelete={handleDelete}
                    isLoading={loading}
                    open={isDialogOpen}
                    setOpen={onDialogClose}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className="trip-image-container">
          <img
            src={trip.photoUri}
            alt="photo"
            width={232}
            height={232}
            className="trip-card-image"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TripCard;
