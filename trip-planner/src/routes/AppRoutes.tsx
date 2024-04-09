import React from "react";
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import PageNotFound from "../pages/Other/PageNotFound";
import Register from "../pages/Auth/Register";
import TripList from "../pages/Trips/TripList";
import Paths from "./Paths";
import CreateTrip from "../pages/Trips/CreateTrip";
import EditTrip from "@/pages/Trips/EditTrip";
import TripDetails from "@/pages/TripDetails/TripDetails";
import TripDetailCreate from "@/pages/TripDetails/TripDetailCreate";
import TripDetailEdit from "@/pages/TripDetails/TripDetailEdit";
import TripDetailView from "@/pages/TripDetails/TripDetailView";
import BudgetList from "@/pages/Budgets/BudgetList";
import CreateBudget from "@/pages/Budgets/CreateBudget";
import TripTravellersView from "@/pages/TripTravellers/TripTravellersView";
import TripAddTraveller from "@/pages/TripTravellers/TripAddTraveller";
import Notifications from "@/pages/Notifications/Notifications";
import EditBudget from "@/pages/Budgets/EditBudget";
import Profile from "@/pages/Profile/Profile";

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
  },
  {
    path: Paths.TRIP_DETAILS_EDIT,
    element: <TripDetailEdit />
  },
  {
    path: Paths.TRIP_DETAILS_VIEW,
    element: <TripDetailView />
  },
  {
    path: Paths.TRIP_TRAVELLERS_VIEW,
    element: <TripTravellersView />
  },
  {
    path: Paths.TRIP_TRAVELLERS_CREATE,
    element: <TripAddTraveller />
  },
  {
    path: Paths.NOTIFICATIONS,
    element: <Notifications />
  },
  {
    path: Paths.BUDGETS,
    element: <BudgetList />
  },
  {
    path: Paths.CREATE_BUDGET,
    element: <CreateBudget />
  },
  {
    path: Paths.EDIT_BUDGET,
    element: <EditBudget />
  },
  {
    path: Paths.PROFILE,
    element: <Profile />
  }
];

export default AppRoutes;