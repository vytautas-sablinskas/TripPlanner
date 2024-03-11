import React from "react";
import Home from "../pages/Home";
import Login from "../pages/Login";
import PageNotFound from "../pages/PageNotFound";
import Register from "../pages/Register";
import TripList from "../pages/Trips/TripList";
import Paths from "./Paths";

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
  }
];

export default AppRoutes;