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
import { DatePickerWithRange } from "@/components/Extra/DatePickerWithRange";
import { useNavigate } from "react-router-dom";
import Paths from "@/routes/Paths";
import "./styles/create-edit-trip.css";
import { toast } from "sonner";
import { addTrip } from "@/api/TripService";
import { getUtcTimeWithoutChangingTime } from "@/utils/date";
import { checkTokenValidity } from "@/utils/jwtUtils";
import { refreshAccessToken } from "@/api/AuthenticationService";
import { useUser } from "@/providers/user-provider/UserContext";
import { CreateEditLoadingButton } from "../../components/Extra/LoadingButton";
import GoogleAutocomplete from "@/components/Extra/GoogleAutocomplete";

const MAX_FILE_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
];

const formSchema = z.object({
  tripTitle: z.string().min(1, {
    message: "Trip name must be at least 1 character.",
  }),
  destinationCountry: z.string().min(1, {
    message: "Destination must be selected.",
  }),
  date: z
    .object({
      from: z.date().nullable(),
      to: z.date().nullable(),
    })
    .refine((date) => {
      return date.from && date.to;
    }, "Please select a date range.")
    .refine((date) => {
      if (!date.from || !date.to) return false;

      const diffInDays = Math.floor(
        (date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24)
      );
      return diffInDays <= 30;
    }, "Your trip is too long! For now trips are only supported up to 30 days."),
  image: z.any(),
});

const CreateTrip = () => {
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState<any>("/default.jpg");
  const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut, isAuthenticated } =
    useUser();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tripTitle: "",
      destinationCountry: "",
      date: {
        from: new Date(),
        to: new Date(),
      },
      image: undefined,
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(Paths.LOGIN);
    }
  }, []);

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File is too large! 2MB Max.", { position: "top-center" });
      return;
    }
    
    if (!ACCEPTED_IMAGE_TYPES.some(acceptedType => acceptedType === file.type)) {
      toast.error("Some files had invalid type. Only JPG and PNG files are allowed", { position: "top-center" });
      return;
    }

    form.setValue("image", file);
    setUploadedImage(URL.createObjectURL(file));
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
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

    const formData = new FormData();

    const fromDate = new Date(data.date.from);
    const toDate = new Date(data.date.to);
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(23, 59, 59, 999);
    const dates = {
      from: getUtcTimeWithoutChangingTime(fromDate),
      to: getUtcTimeWithoutChangingTime(toDate),
    };

    formData.append("title", data.tripTitle);
    formData.append("description", "f");
    formData.append("image", data.image || null);
    formData.append("destinationCountry", data.destinationCountry);
    formData.append("startDate", dates.from || "");
    formData.append("endDate", dates.to || "");

    try {
      const response = await addTrip(formData);
      if (response.ok) {
        const id = await response.json();
        navigate(Paths.TRIP_DETAILS.replace(":id", id));
      } else {
        toast.error("Unexpected error. Try again later", {
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error("Unexpected error. Try again later", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <div className="container-wrapper">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="main-form-container"
        >
          <div className="page-title-wrapper">
            <h1 className="page-title">Add New Trip</h1>
          </div>
          <div className="main-info-container">
            <div className="left-side-container">
              <FormField
                control={form.control}
                name="tripTitle"
                render={({ field }) => (
                  <FormItem className="inputs mb-4">
                    <FormLabel required>Trip Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter trip name" className="w-full"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destinationCountry"
                render={({ field }) => (
                  <FormItem className="inputs mb-4">
                    <FormLabel required>Destination</FormLabel>
                    <FormControl>
                      <GoogleAutocomplete
                        onSelect={(place : any) => {
                          field.onChange(place.formatted_address);
                        }}
                        types={["geocode"]}
                        fields={["formatted_address"]}
                        className="w-full"
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
                  <FormItem className="inputs">
                    <FormLabel required className="mb-4">Trip Date Range</FormLabel>
                    <FormControl>
                      <DatePickerWithRange
                        field={field}
                        className="text-left font-normal"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="right-side-container">
              <div>
                <img
                  src={uploadedImage}
                  height={300}
                  className="image"
                  width={300}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={() => {
                    return (
                      <FormItem className="upload-image-button">
                        <FormLabel>Change To Upload New Image</FormLabel>
                        <FormControl>
                          <Input type="file" onChange={handleFileUpload} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>
          </div>
          <div className="submit-buttons-container">
            <Button type="button" disabled={loading} onClick={() => navigate(Paths.TRIPS)}>
              Cancel
            </Button>
            <CreateEditLoadingButton loading={loading} text="Submit" />
          </div>
        </form>
      </div>
    </Form>
  );
};

export default CreateTrip;
