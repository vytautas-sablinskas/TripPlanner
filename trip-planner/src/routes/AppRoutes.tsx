import React from "react";
import Home from "../pages/Home";
import Login from "../pages/Auth/Login";
import PageNotFound from "../pages/PageNotFound";
import Register from "../pages/Auth/Register";
import TripList from "../pages/Trips/TripList";
import Paths from "./Paths";
import CreateTrip from "../pages/Trips/CreateTrip";
import EditTrip from "@/pages/Trips/EditTrip";
import TripDetails from "@/pages/TripDetails/TripDetails";
import TripDetailCreate from "@/pages/TripDetails/TripDetailCreate";

const AppRoutes = [
  {
    index: true,
    path: Paths.HOME,
    element: <Home />
  },
  {
    path: Paths.LOGIN,
    element: <Login />
  },
  {
    path: Paths.REGISTER,
    element: <Register />
  },
  {
    path: '*',
    element: <PageNotFound />
  },
  {
    path: Paths.TRIPS,
    element: <TripList />
  },
  {
    path: Paths.CREATE_TRIP,
    element: <CreateTrip />
  },
  {
    path: Paths.EDIT_TRIP,
    element: <EditTrip />
  },
  {
    path: Paths.TRIP_DETAILS,
    element: <TripDetails />
  }, 
  {
    path: Paths.TRIP_DETAILS_CREATE,
    element: <TripDetailCreate />
  }
];

export default AppRoutes;