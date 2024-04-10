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
import { useUser } from "@/providers/user-provider/UserContext";
import { useNavigate } from "react-router-dom";
import Paths from "@/routes/Paths";
import { createExpense } from "@/api/ExpensesService";

const formSchema = z.object({
  currency: z.string(),
  amount: z.string().optional(),
  eventType: z.string(),
  name: z.string().optional(),
});

const AddExpenseDialog = ({ open, setOpen, mainCurrency, onAdd, budgetId }: any) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currency: mainCurrency,
      amount: "0",
      eventType: "0",
      name: "",
    },
  });

  
  useEffect(() => {
    form.setValue("currency", mainCurrency);
  }, [mainCurrency]);

  const getTripId = () => {
    const paths = location.pathname.split("/");
    return paths[paths.length - 1];
  };

  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut } = useUser();
  const navigate = useNavigate();

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
        result.data.refreshToken
      );
    }

    setIsLoading(true);
    const response = await createExpense(getTripId(), budgetId, { currency: formValues.currency, type: Number(formValues.eventType), name: formValues.name, amount: Number(formValues.amount) })
    if (!response.ok) {
      toast.error("An error occurred while adding expense", {
        position: "top-center",
      });
      return;
    }

    const data = await response.json();
    onAdd(data, formValues);
    setIsLoading(false);
    setOpen(false);
  };

  const handleClose = (e : any) => {
    e.preventDefault();
    setOpen(false);
  }

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
              <DialogTitle>Add Expense</DialogTitle>
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
            <DialogFooter className="flex flex-col mt-4">
              <DialogClose>
                <Button className="w-full mb-4" disabled={isLoading} onClick={handleClose}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="mb-4" disabled={isLoading}>
                Add Expense
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseDialog;
