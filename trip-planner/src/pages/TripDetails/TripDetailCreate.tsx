import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLocation, useNavigate } from "react-router-dom";
import Paths from "@/routes/Paths";
import { DateTimePicker } from "@/components/Extra/DateTimePicker";
import { ValueSelector } from "../../components/Extra/ValueSelector";
import { ActivityTypes } from "./ActivityTypes";
import "./styles/trip-detail-create-edit.css";
import { Textarea } from "@/components/ui/textarea";
import { checkTokenValidity } from "@/utils/jwtUtils";
import { refreshAccessToken } from "@/api/AuthenticationService";
import { toast } from "sonner";
import { useUser } from "@/providers/user-provider/UserContext";
import { getTripTime } from "@/api/TripService";
import { addTripDetails } from "@/api/TripDetailService";
import { CreateEditLoadingButton } from "../Trips/components/CreateEditLoadingButton";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Plan name is required.",
  }),
  eventType: z.string().min(1, {
    message: "Event type is required.",
  }),
  address: z.string().optional(),
  dates: z.object({
    startDate: z
      .date()
      .optional()
      .refine(
        (value) => {
          return value !== undefined;
        },
        {
          message: "Start Date is required.",
        }
      ),
    endDate: z.date().optional(),
  }),
  notes: z.string().optional(),
});

const CreateTrip = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isDataSubmitting, setIsDataSubmitting] = useState(false);
  const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut } =
    useUser();
  const location = useLocation();
  const [tripTime, setTripTime] = useState<any>(null);

  const getTripId = () => {
    const path = location.pathname.split("/");
    return path[path.length - 2];
  }

  useEffect(() => {
    const tryFetchingTripTime = async () => {
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

      const response = await getTripTime(getTripId());
      if (!response || !response.ok) {
        toast.error("Unexpected error. Try again later", {
          position: "top-center",
        });
        return;
      }

      const data = await response.json();
      setTripTime(data);
      setIsLoading(false);
    };

    tryFetchingTripTime();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      eventType: "",
      dates: {
        startDate: undefined,
        endDate: undefined,
      },
    },
  });

  const isValidDates = (data: any) => {
    const startDateIso = new Date(data.dates.startDate).toISOString();
    let isError = false;

    if (startDateIso < tripTime.startDate || startDateIso > tripTime.endDate) {
      form.setError("dates.startDate", {
        message: "Start date can't exceed set trip times.",
      });
      isError = true;
    }

    if (data.dates.endDate !== undefined) {
      const endDateIso = new Date(data.dates.endDate).toISOString();

      if (endDateIso < startDateIso) {
        form.setError("dates.endDate", {
          type: "manual",
          message: "End date must be after start date.",
        });
        isError = true;
      }

      if (endDateIso > tripTime.endDate || endDateIso < tripTime.startDate) {
        form.setError("dates.endDate", {
          type: "manual",
          message: "End date can't exceed set trip times.",
        });
        isError = true;
      }
    }

    return !isError;
  };

  const onSubmit = async (data: any) => {
    const validDates = isValidDates(data);
    if (!validDates) {
      return;
    }

    setIsLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    setIsDataSubmitting(true);
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

    console.log(data);
    const tripId = getTripId();
    const response = await addTripDetails({
      name: data.name,
      eventType: Number(data.eventType),
      address: data.address,
      notes: data.notes,
      startTime: data.dates.startDate,
      endTime: data.dates.endDate,
      tripId,
    });
    if (!response || !response.ok) {
      toast.error("Unexpected error. Try again later", {
        position: "top-center",
      });
      setIsDataSubmitting(false);
      return;
    }

    navigate(Paths.TRIP_DETAILS.replace(":id", tripId));
  };

  return (
    <Form {...form}>
      <div className="w-full">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="trip-details-container-wrapper">
            <div className="edit-trip-details-main-container">
              <h1 className="trip-details-title">Add Plan</h1>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Plan Name</FormLabel>
                    <FormControl className="w-full mb-4">
                      <Input placeholder="Enter Plan Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Event Type</FormLabel>
                    <FormControl className="w-full mb-4">
                      <ValueSelector
                        value={field.value}
                        setValue={field.onChange}
                        placeholder="Select event type"
                        label="Event Type"
                        items={ActivityTypes}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl className="w-full mb-4">
                      <Input placeholder="Enter Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dates.startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Start Date</FormLabel>
                    <FormControl className="w-full mb-4">
                      <DateTimePicker
                        date={field.value}
                        setDate={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dates.endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl className="w-full mb-4">
                      <DateTimePicker
                        date={field.value}
                        setDate={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl className="w-full mb-4">
                      <Textarea
                        placeholder="Type your notes here."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="create-trip-details-submit-buttons">
              <Button
                disabled={isDataSubmitting}
                onClick={() => navigate(Paths.TRIPS)}
              >
                Cancel
              </Button>
              <CreateEditLoadingButton loading={isDataSubmitting} text="Create Plan" />
            </div>
          </div>
        </form>
      </div>
    </Form>
  );
};

export default CreateTrip;
