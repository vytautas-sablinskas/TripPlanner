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
import { getFormattedDateRange, getLocalDate } from "@/utils/date";
import { BarChart4, CirclePlus, CircleX, Pencil } from "lucide-react";
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

const TripDetails = () => {
  const [tripDetails, setTripDetails] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut } =
    useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [budgetIds, setBudgetIds] = useState<any>([
    { value: "id1", label: "First budget name" },
    { value: "id2", label: "Second budget name" },
  ]);
  const [openId, setOpenId] = useState<any>(null);
  const [selectedBudget, setSelectedBudget] = useState<any>(budgetIds[0]);
  const [openDeleteExpenseDialog, setOpenDeleteExpenseDialog] = useState(false);
  const [openEditExpenseDialog, setOpenEditExpenseDialog] = useState(false);
  const [openAddExpenseDialog, setOpenAddExpenseDialog] = useState(false);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [isDeleteExpenseSubmitting, setIsDeleteExpenseSubmitting] =
    useState(false);
  const [budget, setBudget] = useState<any>({
    id: "id1",
    currency: "USD",
    spentAmount: 113932.51,
    budgetAmount: 50433.56,
    expenses: [
      {
        id: 44,
        currency: "EUR",
        amount: 140.53,
        name: "Dinner at a fancy restaurant",
        type: 0,
        personPhoto: "/avatar-placeholder.png",
        personName: "LebronZE James",
      },
      {
        id: 22,
        currency: "DJF",
        amount: 44.22,
        name: "Dinner at a fancy restaurant",
        type: 1,
        personPhoto: "/avatar-placeholder.png",
        personName: "John Doe",
      },
    ],
  });

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
        result.data.refreshToken
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
        const startDate = getLocalDate(detail.startTime + "Z")
          .toISOString()
          .split("T")[0];
        if (!acc[startDate]) {
          acc[startDate] = [];
        }
        acc[startDate].push(detail);
        return acc;
      },
      {}
    );

    const tripDetails = {
      tripInformation: data.tripInformation,
      data: tripDetailsByDay,
    };

    setIsLoading(false);
    setTripDetails(tripDetails);
  };

  useEffect(() => {
    tryFetchingTripDetails();
  }, []);

  const handleDelete = async () => {
    await tryFetchingTripDetails();
  };

  const onBudgetChange = (value: any) => {
    setSelectedBudget(value);
    console.log(value);
  };

  const getBudgetType = (type: any) => {
    switch (type) {
      case 0:
        return "Food";
      case 1:
        return "Lodging";
      default:
        return "";
    }
  };

  const getBudgetPhoto = (type: any) => {
    switch (type) {
      case 0:
        return "/avatar-placeholder.png";
      case 1:
        return "/avatar-placeholder.png";
      default:
        return "";
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

  const handleDeleteExpense = () => {
    console.log(openId);
  };

  const handeEditSubmit = () => {
    console.log(openId);
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
      {budgetIds && budgetIds.length > 0 && (
        <div className="trip-budget-main-container">
          <div className="trip-budget-information">
            <p className="trip-details-itinerary">Budgeting</p>
            <Button variant="ghost" className="px-0" onClick={() => setOpenAddExpenseDialog(true)}>
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
                  {budget.currency} {budget.spentAmount.toLocaleString()}
                </p>
                <p className="total-budget-amount">
                  Budget: {budget.currency}{" "}
                  {budget.budgetAmount.toLocaleString()}
                </p>
              </div>
              <Progress value={50} className="h-2" />
            </div>
            <div className="right-side-budget">
              <Separator orientation="vertical" className="separator-budget" />
              <div className="">
                <Button variant="ghost" className="breakdown-button">
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
                      <img
                        src={getBudgetPhoto(expense.type)}
                        height={32}
                        width={32}
                        alt=""
                        className="rounded-full w-[32px] h-[32px] mr-3"
                      />
                      <div className="flex flex-col justify-start">
                        <p className="font-bold">{expense.name}</p>
                        <p>{getBudgetType(expense.type)}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex flex-col items-end">
                        <p className="font-bold">
                          {expense.currency} {expense.amount.toLocaleString()}
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
            open={openAddExpenseDialog}
            setOpen={setOpenAddExpenseDialog}
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
            eventType={budget.expenses.find((e: any) => e.id === openId)?.type.toString()}
            open={openEditExpenseDialog}
            setOpen={setOpenEditExpenseDialog}
            id={openId}
          />
        </div>
      )}
    </div>
  );
};

export default TripDetails;
