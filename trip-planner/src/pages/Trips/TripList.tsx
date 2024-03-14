import { useEffect, useState } from "react";
import "./styles/trip-list.css";
import "../../styles/flexbox.css";
import {
  Button,
  Divider,
  Pagination,
  Tab,
  Tabs,
} from "@mui/material";
import { checkTokenValidity } from "../../utils/jwtUtils";
import { toast } from "sonner";
import { useUser } from "../../providers/user-provider/UserContext";
import { refreshAccessToken } from "../../api/AuthenticationService";
import { useNavigate } from "react-router-dom";
import Paths from "../../routes/Paths";
import { getTripsList } from "../../api/TripService";
import {
  AddCircleOutline,
} from "@mui/icons-material";
import { Skeleton } from "@/components/ui/skeleton";
import TripCard from "./components/TripCard";

const TripList = () => {
  const [tabSelected, setTabSelected] = useState(0);
  const [page, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);
  const { changeUserInformationToLoggedOut, changeUserInformationToLoggedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const tryFetchingTrips = async () => {
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

      const response = await getTripsList(tabSelected, page);
      if (!response || !response.ok) {
        toast.error("Unexpected error. Try again later", {
          position: "top-center",
        });
        return;
      }

      const data = await response.json();
      setTrips(data.trips);
      console.log(data);
      setTotalPages(Math.ceil(data.totalTripCount / 5));
      setLoading(false);
    };

    tryFetchingTrips();
  }, [tabSelected, page]);

  return (
    <div className="trip-list-container">
      <Tabs
        value={tabSelected}
        onChange={(_, value) => setTabSelected(value)}
        sx={{ marginTop: "25px" }}
      >
        <Tab
          label="Upcoming Trips"
          sx={{
            borderLeft: "1px solid transparent",
            borderTop: "1px solid transparent",
            borderRight: "1px solid transparent",
            ...(tabSelected === 0 && { borderColor: "rgba(0, 0, 0, 0.12)" }),
          }}
        />
        <Tab
          label="Past Trips"
          sx={{
            borderLeft: "1px solid transparent",
            borderTop: "1px solid transparent",
            borderRight: "1px solid transparent",
            ...(tabSelected === 1 && { borderColor: "rgba(0, 0, 0, 0.12)" }),
          }}
        />
      </Tabs>
      <Divider />
      <Button
        className="flexbox-container-row row-center-vertically add-trip-button"
        sx={{
          padding: "12px 0px",
          "&.MuiButtonBase-root:hover": {
            bgcolor: "transparent",
          },
        }}
        disableRipple
        onClick={() => navigate(Paths.CREATE_TRIP)}
      >
        <AddCircleOutline />
        <p style={{ margin: 0 }}>Add a Trip</p>
      </Button>
      {loading ? (
        <>
          <Skeleton
            style={{ width: "100%", height: "225px", marginBottom: "16px" }}
          />
          <Skeleton
            style={{ width: "100%", height: "225px", marginBottom: "16px" }}
          />
          <Skeleton
            style={{ width: "100%", height: "225px", marginBottom: "16px" }}
          />
          <Skeleton
            style={{ width: "100%", height: "225px", marginBottom: "16px" }}
          />
          <Skeleton
            style={{ width: "100%", height: "225px", marginBottom: "16px" }}
          />
        </>
      ) : (
        trips.map((trip: any) => (
          <TripCard trip={trip} />
        ))
      )}
      <div className="pagination">
          <Pagination
            count={totalPages}
            shape="rounded"
            variant="outlined"
            onChange={(_, value) => setCurrentPage(value)}
          />
        </div>
    </div>
  );
};

export default TripList;
