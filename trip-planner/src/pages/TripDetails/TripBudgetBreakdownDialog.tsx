  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
  import { useEffect, useState } from "react";
  import { AreaChart, BarChart, LineChart } from "@tremor/react";
  import { getUtcTimeWithoutChangingTime } from "@/utils/date";

  const TripBudgetBreakdownDialog = ({
    open,
    setOpen,
    expenses,
    tripStartDate,
    tripEndDate,
    mainCurrency,
    totalBudget
  }: any) => {
    const budgetTypes = [
      "Activity",
      "Travel",
      "Food",
      "Lodging",
      "Shopping",
      "Other",
    ];
    const key = `Expenses By Category`;
    const daysKey = `Expenses By Day`
    const expectedSpendingKey = `Expected Spendings`;
    const totalSpentToDateKey = `Total Spent To Date`;

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
        const time = getUtcTimeWithoutChangingTime(startDate);
        if (!time) {
          continue;
        }

        dates.push(time.split("T")[0]);
        startDate.setDate(startDate.getDate() + 1);
      }
      return dates;
    }

    const startDate = new Date(tripStartDate);
    const endDate = new Date(tripEndDate);
    const allDates = getDates(startDate, endDate);

    function calculateAmountSpentByDay(dates: any, trips: any) {
      const amountSpentByDay: any = {};
      const totalSpentByDay: any = {};
      const averageSpendingByDay: any = {};
      let totalSpent = 0;
    
      dates.forEach((date: any) => {
        amountSpentByDay[date] = 0;
        totalSpentByDay[date] = 0;
      });
    
      trips.forEach((trip: any) => {
        const tripDate = trip.date ? trip.date.split("T")[0] : null;
        const amount = trip.amountInMainCurrency || 0;
    
        if (tripDate && amount && amount !== 0 && dates.includes(tripDate)) {
          amountSpentByDay[tripDate] += amount;
          totalSpent += amount;
        }
      });
    
      const numDays = dates.length;
      const budgetPerDay = totalBudget / numDays;
      dates.forEach((date: any, index: number) => {
        totalSpentByDay[date] = totalSpentByDay[dates[index - 1]] || 0;
        totalSpentByDay[date] += amountSpentByDay[date];
        averageSpendingByDay[date] = budgetPerDay * (index + 1);
      });
    
      const result = Object.keys(amountSpentByDay).map((date) => ({
        date,
        [daysKey]: amountSpentByDay[date].toFixed(2) || 0 ,
        [expectedSpendingKey]: averageSpendingByDay[date].toFixed(2) || 0,
        [totalSpentToDateKey]: totalSpentByDay[date].toFixed(2) || 0,
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

      return Intl.NumberFormat("us").format(numberFixed) + ` ${mainCurrency}`;
    };

    const valueFormatterLineChart = function (number : any) {
      return new Intl.NumberFormat('us').format(number).toString() + ` ${mainCurrency}`;
    };

    const maxValue = allDateSpendings.reduce((max: number | null, day: any) => {
      const dayValue = Math.max(
        parseFloat(day[daysKey]),
        parseFloat(day[expectedSpendingKey]),
        parseFloat(day[totalSpentToDateKey])
      );
    
      return max === null ? dayValue : Math.max(max, dayValue);
    }, null);

    console.log(maxValue);
    const colorOfSpendings = Number(allDateSpendings[allDateSpendings?.length - 1][totalSpentToDateKey]) > Number(allDateSpendings[allDateSpendings?.length - 1][expectedSpendingKey]) ? "red" : "green-600";
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[1000px]">
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
            <AreaChart
              data={allDateSpendings}
              key={allDateSpendings.length}
              index="date"
              categories={[daysKey, expectedSpendingKey, totalSpentToDateKey]}
              colors={["blue-700", "gray-400", colorOfSpendings]}
              maxValue={maxValue}
              yAxisWidth={80}
              tickGap={5}
              valueFormatter={valueFormatterLineChart}
              showAnimation
            />
          )}
          {tabSelected === "categories" && (
            <BarChart
              data={budgetData}
              index="name"
              categories={[key]}
              colors={["blue"]}
              valueFormatter={dataFormatter}
              yAxisWidth={80}
              showAnimation
            />
          )}
        </DialogContent>
      </Dialog>
    );
  };

  export default TripBudgetBreakdownDialog;
