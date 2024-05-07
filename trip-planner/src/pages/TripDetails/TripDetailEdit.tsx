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
import { refreshAccessToken } from "@/services/AuthenticationService";
import { toast } from "sonner";
import { useUser } from "@/providers/user-provider/UserContext";
import { editTripDetails, getTripDetailById } from "@/services/TripDetailService";
import { CreateEditLoadingButton } from "../../components/Extra/LoadingButton";
import { getLocalTimeISOFromDate, getUtcTimeWithoutChangingTime } from "@/utils/date";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GoogleAutocomplete from "@/components/Extra/GoogleAutocomplete";

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
          return value !== undefined && value !== null;
        },
        {
          message: "Start Date is required.",
        }
      ),
    endDate: z.date().optional(),
  }),
  notes: z.string().optional(),
  website: z.string().optional(),
  phoneNumber: z.string().optional(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
});

const TripDetailEdit = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isDataSubmitting, setIsDataSubmitting] = useState(false);
  const [autocompleteSearchType, setAutocompleteSearchType] = useState<any>("address");
  const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut, isAuthenticated } =
    useUser();
  const location = useLocation();
  const [tripTime, setTripTime] = useState<any>();
  const [geometry, setGeometry] = useState<any>(null);

  const getTripDetailsId = () => {
    const path = location.pathname.split("/");
    return path[path.length - 1];
  }

  const getTripId = () => {
    const path = location.pathname.split("/");
    return path[path.length - 3];
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
          result.data.refreshToken,
          result.data.id
        );
      }

      const response = await getTripDetailById(getTripDetailsId(), getTripId());
      if (!response || !response.ok) {
        toast.error("Unexpected error. Try again later", {
          position: "top-center",
        });
        return;
      }

      const data = await response.json();
      console.log(data);
      const startDate = new Date(data.startTime);
      const endDate = data.endTime ? new Date(data.endTime) : undefined;
      form.reset({
        name: data.name,
        eventType: data.eventType.toString(),
        address: data.address,
        dates: {
          startDate,
          endDate,
        },
        notes: data.notes || "",
        website: data.website || "",
        phoneNumber: data.phoneNumber || "",
        latitude: data.latitude || null,
        longitude: data.longitude || null,
      });

      setTripTime({ startDate: data.tripStartTime, endDate: data.tripEndTime });
      setIsLoading(false);
    };

    if (!isAuthenticated) {
      navigate(Paths.LOGIN);
      return;
    }

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
      website: "",
      phoneNumber: "",
      longitude: null,
      latitude: null,
    },
  });

  const isValidDates = (data: any) => {
    let isError = false;

    const startTimeISO = new Date(data.dates.startDate).toISOString();
    const startTripTimeISO = new Date(tripTime.startDate).toISOString();
    const endTripTimeISO = new Date(tripTime.endDate).toISOString();
    if (startTimeISO < startTripTimeISO || startTimeISO > endTripTimeISO) {
      form.setError("dates.startDate", {
        message: "Start date can't exceed set trip times.",
      });
      isError = true;
    }

    if (data.dates.endDate !== undefined) {
      const endTimeISO = getLocalTimeISOFromDate(data.dates.endDate);
      if (endTimeISO < startTimeISO) {
        form.setError("dates.endDate", {
          type: "manual",
          message: "End date must be after start date.",
        });
        isError = true;
      }

      if (endTimeISO > endTripTimeISO || endTimeISO < startTripTimeISO) {
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
    const areDatesValid = isValidDates(data);
    if (!areDatesValid) {
      return;
    }

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
        result.data.refreshToken,
        result.data.id
      );
    }

    const longitude = (geometry && geometry.longitude) || data.longitude || null;
    const latitude = (geometry && geometry.latitude) || (data && data.latitude) || null;

    const response = await editTripDetails({
      name: data.name,
      eventType: Number(data.eventType),
      address: data.address || "",
      notes: data.notes || "",
      startTime: getUtcTimeWithoutChangingTime(data.dates.startDate),
      endTime: getUtcTimeWithoutChangingTime(data.dates.endDate),
      id: getTripDetailsId(),
      phoneNumber: data.phoneNumber,
      website: data.website,
      longitude,
      latitude,
    });
    if (!response || !response.ok) {
      toast.error("Unexpected error. Try again later", {
        position: "top-center",
      });
      setIsDataSubmitting(false);
      return;
    }

    navigate(Paths.TRIP_DETAILS.replace(":id", getTripId()));
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
              <h1 className="trip-details-title">Edit Plan</h1>
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
                name="dates.endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl className="w-full mb-4">
                      <DateTimePicker
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
                        value={field.value}
                        fields={["place_id", "formatted_address", "website", "international_phone_number", "geometry.location"]}
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
              <CreateEditLoadingButton loading={isDataSubmitting} text="Edit Plan" />
            </div>
          </div>
        </form>
      </div>
    </Form>
  ));
};

export default TripDetailEdit;
