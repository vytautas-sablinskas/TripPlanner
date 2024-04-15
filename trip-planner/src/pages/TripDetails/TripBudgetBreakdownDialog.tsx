import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { BarChart, LineChart } from "@tremor/react";

const TripBudgetBreakdownDialog = ({
  open,
  setOpen,
  expenses,
  tripStartDate,
  tripEndDate,
  mainCurrency,
}: any) => {
  const budgetTypes = [
    "Activity",
    "Travel",
    "Food",
    "Lodging",
    "Shopping",
    "Other",
  ];
  const key = `Expenses By Category, ${mainCurrency}`;

  const getBudgetType = (type: any) => {
    switch (type) {
      case 0:
        return "Activity";
      case 1:
        return "Travel";
      case 2:
        return "Food";
      case 3:
        return "Lodging";
      case 4:
        return "Shopping";
      case 5:
        return "Other";
      default:
        return "";
    }
  };

  const budgetData = budgetTypes.map((budgetType) => {
    const totalAmount = expenses
      .filter((expense: any) => getBudgetType(expense.type) === budgetType)
      .reduce(
        (acc: any, expense: any) => acc + expense.amountInMainCurrency,
        0
      );
    return { name: budgetType, [key]: totalAmount };
  });

  function getDates(startDate: any, endDate: any) {
    const dates = [];
    while (startDate <= endDate) {
      dates.push(startDate.toISOString().split("T")[0]);
      startDate.setDate(startDate.getDate() + 1);
    }
    return dates;
  }

  const startDate = new Date(tripStartDate);
  const endDate = new Date(tripEndDate);
  const allDates = getDates(startDate, endDate);

  function calculateAmountSpentByDay(dates: any, trips: any) {
    const amountSpentByDay: any = {};

    dates.forEach((date: any) => {
      amountSpentByDay[date] = 0;
    });

    trips.forEach((trip: any) => {
      const tripDate = trip.date ? trip.date.split("T")[0] : null;
      const amount = trip.amountInMainCurrency || 0;

      if (tripDate && amount && amount !== 0 && dates.includes(tripDate)) {
        amountSpentByDay[tripDate] += amount;
      }
    });

    const result = Object.keys(amountSpentByDay).map((date) => ({
      date,
      Expenses: amountSpentByDay[date],
    }));

    return result;
  }

  const [allDateSpendings, setAllDateSpendings] = useState<any>(calculateAmountSpentByDay(allDates, expenses))
  useEffect(() => {
    setAllDateSpendings(calculateAmountSpentByDay(allDates, expenses));
  }, [expenses]);

  const [tabSelected, setTabSelected] = useState<any>("days");

  const dataFormatter = (number: number) => {
    const numberFixed = Number(number.toFixed(2));

    return Intl.NumberFormat("us").format(numberFixed);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle className="text-left">Budget Breakdown</DialogTitle>
        </DialogHeader>
        <Tabs
          value={tabSelected}
          onValueChange={setTabSelected}
          className="w-full"
        >
          <TabsList className="w-full">
            <TabsTrigger value="days" className="w-full">
              Days
            </TabsTrigger>
            <TabsTrigger value="categories" className="w-full">
              Categories
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {tabSelected === "days" && (
          <LineChart
            className="h-72"
            data={allDateSpendings}
            key={allDateSpendings.length}
            index="date"
            categories={["Expenses"]}
            colors={["blue-700"]}
            yAxisWidth={30}
          />
        )}
        {tabSelected === "categories" && (
          <BarChart
            data={budgetData}
            index="name"
            categories={[key]}
            colors={["blue"]}
            valueFormatter={dataFormatter}
            yAxisWidth={48}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TripBudgetBreakdownDialog;
