import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
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

const formSchema = z.object({
  currency: z.string(),
  amount: z.string().optional(),
  eventType: z.string(),
});

const EditExpenseDialog = ({
  currencyValue,
  amount,
  eventType,
  open,
  setOpen,
  handeEditSubmit,
}: any) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currency: currencyValue,
      amount: amount || "0",
      eventType: eventType,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    form.setValue("currency", currencyValue);
    form.setValue("amount", amount);
    form.setValue("eventType", eventType);
  }, [open]);

  const onSubmit = (formValues: any) => {
    if (!formValues.amount || formValues.amount === "0") {
      form.setError("amount", {
        message: "Expense amount has to be greater than 0",
      });
      return;
    }

    setIsLoading(true);
    handeEditSubmit(formValues);
    setIsLoading(false);
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
              name="amount"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel required>Amount</FormLabel>
                  <FormControl>
                    <CurrencyInput
                      className="create-edit-budget-currency-input z-50"
                      decimalSeparator="."
                      placeholder="Please enter a number"
                      suffix={` ${form.getValues("currency")}`}
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
                <Button className="w-full mb-4" disabled={isLoading}>
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
