import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DateTimePicker } from "@/components/Extra/DateTimePicker";
import {
  getLocalDate,
  getUtcTime,
  getUtcTimeWithoutChangingTime,
} from "@/utils/date";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";

const formSchema = z.object({
  startDate: z.date().optional(),
  selectedTrip: z.any().optional(),
});

const AddUnselectedDetailToTripDialog = ({
  open,
  setOpen,
  trips,
  onSubmit,
  isLoading,
}: any) => {
  const [selectedTrip, setSelectedTrip] = useState<any>(
    trips.length > 0 ? trips[0].id : ""
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: selectedTrip?.startDate,
    },
  });

  const onAdd = () => {
    if (!selectedTrip) return;

    const date = form.getValues("startDate");
    if (!date) return;

    const formattedStartDate = getUtcTimeWithoutChangingTime(date);
    if (formattedStartDate === null) return;
    
    const startDateUtc = new Date(selectedTrip.startDate + "Z");
    const endDateUtc = new Date(selectedTrip.endDate + "Z");
    const dateForComparison = new Date(formattedStartDate);
    
    if (!dateForComparison || dateForComparison < startDateUtc || dateForComparison > endDateUtc) {
        form.setError("startDate", {
            type: "manual",
            message: "Selected date is not within the trip start and end date",
        });
        return;
    }

    form.clearErrors("startDate");
    onSubmit(formattedStartDate, selectedTrip.id);
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onAdd)} className="flex flex-col">
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Plan To Trip</DialogTitle>
            </DialogHeader>
            <FormField
              control={form.control}
              name="selectedTrip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Trip</FormLabel>
                  <FormControl className="w-full mb-4">
                    <Select
                      value={selectedTrip}
                      onValueChange={setSelectedTrip}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="No upcoming trips found" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {trips.map((trip: any) => (
                            <SelectItem key={trip.id} value={trip}>
                              {trip.title}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Start Date</FormLabel>
                  <FormControl className="w-full mb-4">
                    <DateTimePicker
                      date={field.value}
                      setDate={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Trip starts at {selectedTrip.startDate} and ends at{" "}
                    {selectedTrip.endDate}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose>
                <Button
                  className="w-full mb-2"
                  type="button"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="mb-2 flex"
                onClick={() => onAdd()}
                disabled={isLoading}
              >
                <CirclePlus className="w-4 h-4 mr-2" />
                Add Plan
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
};

export default AddUnselectedDetailToTripDialog;
