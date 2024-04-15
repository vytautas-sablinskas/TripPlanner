import { Button } from "@/components/ui/button";
import "./styles/trip-details.css";
import { Separator } from "@/components/ui/separator";
import TripDetailsAccordion from "./TripDetailsAccordion";
import { useEffect, useState } from "react";
import { checkTokenValidity } from "@/utils/jwtUtils";
import { refreshAccessToken } from "@/api/AuthenticationService";
import { useUser } from "@/providers/user-provider/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Paths from "@/routes/Paths";
import { getTripDetails } from "@/api/TripDetailService";
import { getFormattedDateRange, getLocalDate, getUtcTimeWithoutChangingTime } from "@/utils/date";
import { Backpack, BarChart4, BedDouble, CircleHelp, CirclePlus, CircleX, Pencil, PersonStanding, ShoppingCart, Utensils } from "lucide-react";
import { ValueSelector } from "@/components/Extra/ValueSelector";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import DeleteDialog from "@/components/Extra/DeleteDialog";
import EditExpenseDialog from "./EditExpenseDialog";
import AddExpenseDialog from "./AddExpenseDialog";
import { getTripBudget } from "@/api/TripBudgetsService";
import { deleteExpense } from "@/api/ExpensesService";
import GoogleMapExtension from "@/components/Extra/GoogleMapExtension";
import TripBudgetBreakdownDialog from "./TripBudgetBreakdownDialog";

const TripDetails = () => {
  const [tripDetails, setTripDetails] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut } =
    useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [budgetIds, setBudgetIds] = useState<any>([]);
  const [openId, setOpenId] = useState<any>(null);
  const [selectedBudget, setSelectedBudget] = useState<any>(null);
  const [openDeleteExpenseDialog, setOpenDeleteExpenseDialog] = useState(false);
  const [openEditExpenseDialog, setOpenEditExpenseDialog] = useState(false);
  const [openAddExpenseDialog, setOpenAddExpenseDialog] = useState(false);
  const [isDeleteExpenseSubmitting, setIsDeleteExpenseSubmitting] =
    useState(false);
  const [budget, setBudget] = useState<any>(null);
  const [mapInformation, setMapInformation] = useState<any>([]);
  const [isBreakdownOpen, setIsBreakdownOpen] = useState<any>(false);
  const [breakdownTrips, setBreakdownTrips] = useState<any>([]);

  const getTripId = () => {
    const paths = location.pathname.split("/");
    return paths[paths.length - 1];
  };

  const tryFetchingTripDetails = async () => {
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

    const response = await getTripDetails(getTripId());
    if (!response || !response.ok) {
      toast.error("Unexpected error. Try again later", {
        position: "top-center",
      });
      return;
    }

    const data = await response.json();

    const tripDetailsByDay = data.tripDetails.reduce(
      (acc: any, detail: any) => {
        const date = getUtcTimeWithoutChangingTime(new Date(detail.startTime));
        if (!date) return acc;

        const startDate = date.split("T")[0];
        if (!acc[startDate]) {
          acc[startDate] = [];
        }
        acc[startDate].push(detail);
        return acc;
      },
      {}
    );

    const tripDetailsByDayArray = Object.entries(tripDetailsByDay);

    tripDetailsByDayArray.sort(([dateA], [dateB]) => {
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });

    const sortedTripDetailsByDay = tripDetailsByDayArray.reduce((acc : any, [date, details] : any) => {
      acc[date] = details;
      return acc;
    }, {});

    const tripMapInformation: Record<string, { lat: number; lng: number }[]> = {};

    Object.keys(sortedTripDetailsByDay).forEach((day: string) => {
      const detailsForDay = sortedTripDetailsByDay[day];
      const latLngArray = detailsForDay
        .filter((detail: any) => detail.latitude !== null && detail.longitude !== null)
        .map((detail: any) => ({
          lat: detail.latitude,
          lng: detail.longitude,
          title: detail.name,
          info: detail.description
        }));

      tripMapInformation[day] = latLngArray;
    });

    setMapInformation(tripMapInformation);

    const tripDetails = {
      tripInformation: data.tripInformation,
      data: tripDetailsByDay,
    };
  
    setIsLoading(false);
    setTripDetails(tripDetails);

    if (!data.budgets || data.budgets.length === 0) return;

    setBudgetIds(data.budgets);
    setSelectedBudget(data.budgets[0].value);
  };

  useEffect(() => {
    const fetchBudget = async () => {
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

      const response = await getTripBudget(getTripId(), selectedBudget);
      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setBudget(data);
      setOpenId(data.id);
    };

    if (!selectedBudget) return;

    fetchBudget();
  }, [selectedBudget]);

  useEffect(() => {
    tryFetchingTripDetails();
  }, []);

  const handleDelete = async () => {
    await tryFetchingTripDetails();
  };

  const onBudgetChange = (value: any) => {
    setSelectedBudget(value);
  };

  const getBudgetType = (type: any) => {
    switch (type) {
      case 0:
        return "Activity";
      case 1:
        return "Travel";
      case 2:
        return "Food";
      case 3:
        return "Lodging"
      case 4:
        return "Shopping"
      case 5:
        return "Other"
      default:
        return "";
    }
  };

  const getBudgetPhoto = (type: any) => {
    switch (type) {
      case 0:
        return <PersonStanding className="w-4 h-4"/>;
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

  const handleOpenDeleteDialog = (id: any) => {
    setOpenId(id);
    setOpenDeleteExpenseDialog(true);
  };

  const handleEditExpense = (id: any) => {
    setOpenId(id);
    setOpenEditExpenseDialog(true);
  };

  const handleDeleteExpense = async () => {
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

    setIsDeleteExpenseSubmitting(true);
    const response = await deleteExpense(getTripId(), selectedBudget, openId);
    if (!response.ok) {
      toast.error("An error occurred while deleting expense", {
        position: "top-center",
      });
      setIsDeleteExpenseSubmitting(false);
      return;
    }

    const data = await response.json();

    const newExpenses = budget.expenses.filter(
      (e: any) => e.id !== openId
    );
    setBudget({
      ...budget,
      spentAmount: data.amount,
      expenses: newExpenses,
    });
    setIsDeleteExpenseSubmitting(false);
    setOpenDeleteExpenseDialog(false);
  };

  const handeEditSubmit = (formValues: any, response : any) => {
    setBudget({
      ...budget,
      spentAmount: response.amount,
      expenses: budget.expenses.map((e: any) => {
        if (e.id === openId) {
          return {
            ...e,
            name: formValues.name,
            currency: formValues.currency,
            amount: Number(formValues.amount),
            type: Number(formValues.eventType),
          };
        }
        return e;
      }),
    })
    setOpenEditExpenseDialog(false);
  };

  const getSpentAmountPercentage = () => {
    const percentage = (budget.spentAmount / budget.budgetAmount) * 100;
    return percentage > 100 || budget.unlimitedBudget ? 100 : percentage;
  };

  const onExpenseAdd = (response: any, formValues: any) => {
    console.log(formValues);
    setBudget({
      ...budget,
      spentAmount: response.amount,
      expenses: [
        ...budget.expenses,
        {
          id: response.id,
          name: formValues.name,
          currency: formValues.currency,
          amount: Number(formValues.amount),
          type: Number(formValues.eventType),
          personPhoto: response.personPhoto,
          personName: response.personName,
        },
      ],
    });
  };

  return isLoading ? (
    <div>Loading</div>
  ) : (
    <div className="main-container">
      <div className="trip-information-container">
        <div className="trip-information-content">
          <h1 className="trip-information-title">
            {tripDetails.tripInformation.title}
          </h1>
          <p>{tripDetails?.tripInformation.destinationCountry}</p>
          <p className="trip-information-time">
            {getFormattedDateRange(
              tripDetails.tripInformation.startDate,
              tripDetails.tripInformation.endDate
            )}
          </p>
        </div>
        <img
          src={tripDetails.tripInformation.photoUri}
          height={232}
          width={232}
          alt="trip"
          className="image trip-information-image"
        />
      </div>
      <div className="map-container">
        <GoogleMapExtension mapLocations={mapInformation}/>
      </div>

      <div className="trip-details-main-container">
        <div className="trip-details-information">
          <p className="trip-details-itinerary">Itinerary</p>
          <Button
            onClick={() =>
              navigate(Paths.TRIP_DETAILS_CREATE.replace(":id", getTripId()))
            }
            className="rounded-xl"
            variant="ghost"
          >
            <CirclePlus className="mr-2" />
            Add New Plan
          </Button>
        </div>
        <Separator className="my-4" />
      </div>
      <div className="events-container">
        <TripDetailsAccordion
          tripDetails={tripDetails.data}
          onDelete={handleDelete}
        />
      </div>
      {budgetIds && budgetIds.length > 0 && budget && (
        <div className="trip-budget-main-container">
          <div className="trip-budget-information">
            <p className="trip-details-itinerary">Budgeting</p>
            <Button
              variant="ghost"
              className="px-0"
              onClick={() => setOpenAddExpenseDialog(true)}
            >
              <CirclePlus className="mr-2" />
              Add Expense
            </Button>
          </div>
          <div className="flex flex-col justify-start items-start w-full mt-4">
            <ValueSelector
              value={selectedBudget}
              setValue={onBudgetChange}
              placeholder="Select Budget"
              label="Budgets"
              items={budgetIds}
            />
          </div>
          <div className="trip-budget-all-info">
            <div className="trip-budget-all-info-first-column">
              <div className="flex m-2 justify-between items-end">
                <p className="spent-budget-currency">
                  {budget.currency}{" "}
                  {budget.spentAmount.toFixed(2).toLocaleString()}
                </p>
                <p className="total-budget-amount">
                  {budget.unlimitedBudget ? "Unlimited Budget" : `Budget: ${budget.currency} ${budget.budgetAmount.toLocaleString()}`}
                </p>
              </div>
              <Progress value={getSpentAmountPercentage()} className="h-2" />
            </div>
            <div className="right-side-budget">
              <Separator orientation="vertical" className="separator-budget" />
              <div className="">
                <Button variant="ghost" className="breakdown-button ml-2" onClick={() => setIsBreakdownOpen(true)}>
                  <BarChart4 className="mr-2 text-sm" />
                  View Breakdown
                </Button>
              </div>
            </div>
          </div>
          <Accordion
            type="single"
            collapsible
            className="w-full overflow-visible"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>Expenses</AccordionTrigger>
              <AccordionContent>
                {budget.expenses.map((expense: any) => (
                  <div
                    className="h-full w-full flex justify-between mt-4"
                    key={expense.id}
                  >
                    <div className="flex items-center justify-center">
                      <div className="w-[32px] h-[32px] rounded-full mr-3 bg-gray-300 flex justify-center items-center">
                        {getBudgetPhoto(expense.type)}
                      </div>

                      <div className="flex flex-col justify-start">
                        <p className="font-bold">{expense.name}</p>
                        <p>{getBudgetType(expense.type)}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex flex-col items-end">
                        <p className="font-bold">
                          {expense.currency}{" "}
                          {expense.amount.toFixed(2).toLocaleString()}
                        </p>
                        <div className="expense-person-photo-container">
                          <div className="expense-person-image-name-container">
                            {expense.personName}
                          </div>
                          <img
                            src={expense.personPhoto}
                            height={20}
                            width={20}
                            alt="person"
                            className="expense-person-photo"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col items-center h-[50px] ml-8">
                        <Button
                          className="p-0"
                          variant="ghost"
                          onClick={() => handleEditExpense(expense.id)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          className="p-0"
                          onClick={() => handleOpenDeleteDialog(expense.id)}
                        >
                          <CircleX className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <AddExpenseDialog
            mainCurrency={budget.currency}
            open={openAddExpenseDialog}
            setOpen={setOpenAddExpenseDialog}
            onAdd={onExpenseAdd}
            budgetId={selectedBudget}
          />
          <DeleteDialog
            title="Delete Expense"
            description="Are you sure you want to delete this expense?"
            dialogButtonText="Delete"
            setOpen={setOpenDeleteExpenseDialog}
            open={openDeleteExpenseDialog}
            onDelete={handleDeleteExpense}
            isLoading={isDeleteExpenseSubmitting}
          />
          <EditExpenseDialog
            currencyValue={
              budget.expenses.find((e: any) => e.id === openId)?.currency
            }
            amount={budget.expenses
              .find((e: any) => e.id === openId)
              ?.amount.toString()}
            eventType={budget.expenses
              .find((e: any) => e.id === openId)
              ?.type.toString()}
            open={openEditExpenseDialog}
            setOpen={setOpenEditExpenseDialog}
            expenseId={openId}
            handeEditSubmit={handeEditSubmit}
            name={budget.expenses.find((e: any) => e.id === openId)?.name}
            budgetId={selectedBudget}
          />
          <TripBudgetBreakdownDialog 
            open={isBreakdownOpen}
            setOpen={setIsBreakdownOpen}
            trips={budget.expenses}
            tripStartDate={tripDetails.tripInformation.startDate}
            tripEndDate={tripDetails.tripInformation.endDate}
            mainCurrency={budget.currency}
          />
        </div>
      )}
    </div>
  );
};

export default TripDetails;
