import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { CreateEditLoadingButton } from "../../components/Extra/LoadingButton";
import { getLocalTimeISOFromDate, getLocalTimeISOFromString } from "@/utils/date";
import GoogleAutocomplete from "@/components/Extra/GoogleAutocomplete";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Plan name is required.",
  }),
  eventType: z.string().min(1, {
    message: "Plan type is required.",
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
  phoneNumber: z.string().optional(),
  website: z.string().optional(),
  notes: z.string().optional(),
});

const TripDetailCreate = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [autocompleteSearchType, setAutocompleteSearchType] = useState<any>("address");
  const [isDataSubmitting, setIsDataSubmitting] = useState(false);
  const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut } =
    useUser();
  const location = useLocation();
  const [tripTime, setTripTime] = useState<any>(null);
  const [geometry, setGeometry] = useState<any>(null);

  const getTripId = () => {
    const path = location.pathname.split("/");
    return path[path.length - 2];
  }

  useEffect(() => {
    const tryFetchingTripTime = async () => {
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
      console.log(data);
      setTripTime({
        startDate: getLocalTimeISOFromString(data.startDate + "Z"),
        endDate: getLocalTimeISOFromString(data.endDate + "Z"),
      });
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
      phoneNumber: "",
      website: "",
    },
  });

  const isValidDates = (data: any) => {
    const startDateIso = getLocalTimeISOFromDate(data.dates.startDate);
    let isError = false;

    console.log(startDateIso, tripTime.startDate, tripTime.endDate);
    if (startDateIso < tripTime.startDate || startDateIso > tripTime.endDate) {
      form.setError("dates.startDate", {
        message: "Start date can't exceed set trip times.",
      });
      isError = true;
    }

    if (data.dates.endDate !== undefined) {
      const endDateIso = getLocalTimeISOFromDate(data.dates.endDate);

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

    const tripId = getTripId();
    const response = await addTripDetails({
      name: data.name,
      eventType: Number(data.eventType),
      address: data.address,
      notes: data.notes,
      startTime: data.dates.startDate,
      endTime: data.dates.endDate,
      phoneNumber: data.phoneNumber,
      website: data.website,
      lng: geometry?.lng,
      lat: geometry?.lat,
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
    isLoading ? (
      <div>Loading...</div>
    ) : (
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
                    <FormLabel required>Plan Type</FormLabel>
                    <FormControl className="w-full mb-4">
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
                    <FormDescription>Trip starts at {tripTime.startDate}</FormDescription>
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
                    <FormDescription>Trip ends at {tripTime.endDate}</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-end">
                      <FormLabel className="mb-2">Destination</FormLabel>
                      <div className="flex space-x-2">
                        <Select onValueChange={setAutocompleteSearchType} value={autocompleteSearchType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Destination Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="address">By Address</SelectItem>
                              <SelectItem value="establishment">By Popular Places</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <FormControl>
                      <GoogleAutocomplete
                        onSelect={(place : any) => {
                          setGeometry({
                            latitude: place?.geometry?.location?.lat(),
                            longitude: place?.geometry?.location?.lng(),
                          })
                          field.onChange(place.formatted_address);
                          form.setValue("website", place.website);
                          form.setValue("phoneNumber", place.international_phone_number);
                        }}
                        fields={["formatted_address", "website", "international_phone_number", "geometry.location"]}
                        types={[autocompleteSearchType]}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl className="w-full mb-4">
                      <Input placeholder="Enter website" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl className="w-full mb-4">
                      <Input placeholder="Enter Phone Number" {...field} />
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
                onClick={() => navigate(Paths.TRIP_DETAILS.replace(":id", getTripId()))}
                type="button"
              >
                Cancel
              </Button>
              <CreateEditLoadingButton loading={isDataSubmitting} text="Create Plan" />
            </div>
          </div>
        </form>
      </div>
    </Form>
  ));
};

export default TripDetailCreate;
