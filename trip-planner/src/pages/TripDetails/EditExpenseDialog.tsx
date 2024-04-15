import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CurrencySelector } from "../Budgets/CurrencySelector";
import CurrencyInput from "react-currency-input-field";
import { ActivityTypes } from "./ActivityTypes";
import { ValueSelector } from "@/components/Extra/ValueSelector";
import { Input } from "@/components/ui/input";
import { checkTokenValidity } from "@/utils/jwtUtils";
import { refreshAccessToken } from "@/api/AuthenticationService";
import { toast } from "sonner";
import Paths from "@/routes/Paths";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/providers/user-provider/UserContext";
import { editExpense } from "@/api/ExpensesService";
import { DateTimePicker } from "@/components/Extra/DateTimePicker";
import { DatePicker } from "@/components/Extra/DatePicker";
import { getUtcTimeWithoutChangingTime } from "@/utils/date";

const formSchema = z.object({
  currency: z.string(),
  amount: z.string().optional(),
  eventType: z.string(),
  name: z.string().optional(),
  date: z.date().optional(),
});

const EditExpenseDialog = ({
  currencyValue,
  amount,
  eventType,
  name,
  open,
  setOpen,
  handeEditSubmit,
  budgetId,
  expenseId,
  tripTime,
  currentDate
}: any) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currency: currencyValue,
      amount: amount || "0",
      eventType: eventType,
      name: name || "",
      date: currentDate ? new Date(currentDate) : undefined,
    },
  });

  console.log(currentDate);

  const getTripId = () => {
    const paths = location.pathname.split("/");
    return paths[paths.length - 1];
  };

  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut } =
    useUser();

  useEffect(() => {
    form.setValue("currency", currencyValue);
    form.setValue("amount", amount);
    form.setValue("eventType", eventType);
    form.setValue("name", name);
    form.setValue("date", new Date(currentDate));
  }, [open]);

  const onSubmit = async (formValues: any) => {
    if (!formValues.amount || formValues.amount === "0") {
      form.setError("amount", {
        message: "Expense amount has to be greater than 0",
      });
      return;
    }

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

    setIsLoading(true);
    const newDto = {
      currency: formValues.currency,
      type: Number(formValues.eventType),
      name: formValues.name,
      amount: Number(formValues.amount),
      date: getUtcTimeWithoutChangingTime(formValues.date)
    }
    const response = await editExpense(getTripId(), budgetId, expenseId, newDto);
    if (!response.ok) {
      toast.error("Failed to edit expense", {
        position: "top-center",
      });
      setIsLoading(false);
      return;
    }

    const data = await response.json();

    handeEditSubmit(newDto, data);
    setIsLoading(false);
  };

  const handleCancel = (e: any) => {
    e.preventDefault();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={() => !isLoading && setOpen(!open)}>
      <DialogContent
        className="sm:max-w-[525px]"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit Expense</DialogTitle>
            </DialogHeader>
            <FormField
              control={form.control}
              name="eventType"
              render={({ field }) => (
                <FormItem className=" mt-4">
                  <FormLabel required>Plan Type</FormLabel>
                  <FormControl className="w-full">
                    <ValueSelector
                      value={field.value}
                      setValue={field.onChange}
                      placeholder="Select plan type"
                      label="Plan Type"
                      items={ActivityTypes}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel required>Currency</FormLabel>
                  <FormControl>
                    <CurrencySelector
                      value={field.value}
                      setValue={field.onChange}
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                      modal
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel required>Amount</FormLabel>
                  <FormControl>
                    <CurrencyInput
                      className="create-edit-budget-currency-input z-50"
                      decimalSeparator="."
                      placeholder="Please enter a number"
                      prefix={`${form.getValues("currency")} `}
                      step={1}
                      value={field.value}
                      allowNegativeValue={false}
                      allowDecimals={true}
                      onValueChange={(value, _name, _values) =>
                        field.onChange(
                          Number(value) > 100000 ? "100000" : value
                        )
                      }
                      autoFocus={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Date</FormLabel>
                    <FormControl className="w-full mb-4">
                      <DatePicker
                        date={field.value}
                        setDate={field.onChange}
                        startDate={tripTime.startDate}
                        endDate={tripTime.endDate}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className=" mt-4">
                  <FormLabel>Name</FormLabel>
                  <FormControl className="w-full">
                    <Input {...field} placeholder="Enter name of expense" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex flex-col mt-4">
              <DialogClose>
                <Button
                  className="w-full mb-4"
                  disabled={isLoading}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="mb-4" disabled={isLoading}>
                Edit Expense
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditExpenseDialog;
