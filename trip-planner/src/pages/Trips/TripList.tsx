import { useEffect, useRef, useState } from "react";
import "./styles/trip-list.css";
import "../../styles/flexbox.css";
import { checkTokenValidity } from "../../utils/jwtUtils";
import { toast } from "sonner";
import { useUser } from "../../providers/user-provider/UserContext";
import { refreshAccessToken } from "../../services/AuthenticationService";
import { useNavigate } from "react-router-dom";
import Paths from "../../routes/Paths";
import { getTripsList } from "../../services/TripService";
import { Skeleton } from "@/components/ui/skeleton";
import TripCard from "./components/TripCard";
import { PaginationExtension } from "@/components/Extra/PaginationExtension";
import { CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const TripList = () => {
  const [tabSelected, setTabSelected] = useState("Upcoming");
  const [page, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const totalTripsCount = useRef(0);
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);
  const {
    changeUserInformationToLoggedOut,
    changeUserInformationToLoggedIn,
    isAuthenticated,
  } = useUser();
  const navigate = useNavigate();

  const tryFetchingTrips = async () => {
    setLoading(true);
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

    const response = await getTripsList(tabSelected, page);
    if (!response || !response.ok) {
      toast.error("Unexpected error. Try again later", {
        position: "top-center",
      });
      return;
    }

    const data = await response.json();
    setTrips(data.trips);
    setTotalPages(Math.ceil(data.totalTripCount / 5));
    totalTripsCount.current = data.totalTripCount;
    setLoading(false);
  };

  const onDelete = async () => {
    totalTripsCount.current -= 1;

    if (totalTripsCount.current % 5 === 0 && page !== 1) {
      setCurrentPage(page - 1);
    } else {
      await tryFetchingTrips();
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(Paths.LOGIN);
      return;
    }

    tryFetchingTrips();
  }, [page, tabSelected]);

  useEffect(() => {
    setCurrentPage(1);
  }, [tabSelected]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div className="trip-list-container">
      <h1 className="my-4 font-bold text-4xl">Your Trips</h1>
      <span className="add-trip-container">
        <Button
          className="add-trip-button"
          variant="ghost"
          onClick={() => navigate(Paths.CREATE_TRIP)}
        >
          <CirclePlus />
          <p className="ml-2">Add a Trip</p>
        </Button>
        <Tabs value={tabSelected} onValueChange={setTabSelected}>
          <TabsList>
            <TabsTrigger value="Upcoming">Current Trips</TabsTrigger>
            <TabsTrigger value="Past">Past Trips</TabsTrigger>
          </TabsList>
        </Tabs>
      </span>
      <Separator className="mb-4" />
      {loading ? (
        <>
          <Skeleton
            style={{ width: "100%", height: "232px", marginBottom: "16px" }}
          />
          <Skeleton
            style={{ width: "100%", height: "232px", marginBottom: "16px" }}
          />
          <Skeleton
            style={{ width: "100%", height: "232px", marginBottom: "16px" }}
          />
          <Skeleton
            style={{ width: "100%", height: "232px", marginBottom: "16px" }}
          />
          <Skeleton
            style={{ width: "100%", height: "232px", marginBottom: "16px" }}
          />
        </>
      ) : (
        trips.map((trip: any) => (
          <TripCard trip={trip} key={trip.id} onDelete={onDelete} />
        ))
      )}
      {!loading && totalPages !== 0 && (
        <div className="pagination">
          <PaginationExtension
            page={page}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default TripList;
