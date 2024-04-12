import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { BarChart, LineChart } from "@tremor/react";

const TripBudgetBreakdownDialog = ({ open, setOpen, trips, tripStartDate, tripEndDate, mainCurrency }: any) => {
    const budgetTypes = ["Activity", "Travel", "Food", "Lodging", "Shopping", "Other"];
    const key = `Expenses By Category, ${mainCurrency}`;

    const getBudgetType = (type : any) => {
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
        
        const totalAmount = trips
          .filter((expense : any) => getBudgetType(expense.type) === budgetType)
          .reduce((acc : any, expense : any) => acc + expense.amountInMainCurrency, 0);
        return { name: budgetType, [key]: totalAmount };
      });
      
      console.log(budgetData);

    function getDates(startDate : any, endDate : any) {
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

  const [tabSelected, setTabSelected] = useState<any>("days");

  const chartdata2 = [
    {
      date: "Jan 23",
      Expenses: 167,
    },
    {
      date: "Feb 23",
      Expenses: 125,
    },
    {
      date: "Mar 23",
      Expenses: 156,
    },
    {
      date: "Apr 23",
      Expenses: 165,
    },
    {
      date: "May 23",
      Expenses: 153,
    },
    {
      date: "Jun 23",
      Expenses: 124,
    },
  ];

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
            data={chartdata2}
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
