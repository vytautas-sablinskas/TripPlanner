import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button, Menu, MenuItem } from "@mui/material";
import "../styles/trip-list.css";
import "./styles/trip-card.css"
import { getFormattedDateRange } from "@/utils/date";
import { KeyboardArrowDown } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Paths from "@/routes/Paths";
import { DeleteDialog } from "@/components/Extra/DeleteDialog";
import { checkTokenValidity } from "@/utils/jwtUtils";
import { refreshAccessToken } from "@/api/AuthenticationService";
import { toast } from "sonner";
import { useUser } from "@/providers/user-provider/UserContext";
import { deleteTrip } from "@/api/TripService";

const TripCard = ({ trip, onDelete }: any) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openEditMenu = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
  };
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut } = useUser();

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
  }

  return (
    <Card key={trip.id} className="h-225 w-full mb-6 border border-gray-300">
      <CardContent
        className="flex justify-between h-full"
        style={{ padding: 0 }}
      >
        <div className="flex flex-col flex-grow p-6">
          <div>
            <p className="trip-title" onClick={() => navigate(Paths.TRIP_DETAILS.replace(":id", trip.id))}>{trip.title}</p>
            <p
              style={{
                marginTop: "4px",
                fontSize: "16px",
                color: "rgba(0, 0, 0, 0.87)",
              }}
            >
              {trip.destinationCountry}
            </p>
            <p
              style={{
                marginTop: "4px",
                fontSize: "16px",
                color: "rgb(102, 102, 102)",
              }}
            >
              {getFormattedDateRange(trip.startDate, trip.endDate)}
            </p>
          </div>
          <div>
            <span>
              <Button
                variant="outlined"
                endIcon={<KeyboardArrowDown />}
                onClick={handleClick}
              >
                Manage Trip
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={openEditMenu}
                onClose={handleClose}
                disableScrollLock={true}
              >
                <MenuItem onClick={() => navigate(Paths.EDIT_TRIP.replace(":id", trip.id))}>Edit Trip Information</MenuItem>
                <MenuItem>Manage Trip Budgets</MenuItem>
                <MenuItem>Manage Travellers</MenuItem>
              </Menu>
            </span>
            <DeleteDialog 
              buttonText="Delete Trip"
              title="Delete Trip"
              description="Are you sure you want to delete this trip? This will permanently delete this trip and its contents. You and all trip participants will not be able to access the trip or any trip plans."
              dialogButtonText="Delete"
              onDelete={handleDelete}
              loading={loading}
            />
          </div>
        </div>
        <div className="trip-image-container">
          <img
            src={trip.photoUri}
            alt="photo"
            style={{ width: "225px", height: "225px", objectFit: "cover", borderTopRightRadius: '7px', borderBottomRightRadius: '7px' }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TripCard;
