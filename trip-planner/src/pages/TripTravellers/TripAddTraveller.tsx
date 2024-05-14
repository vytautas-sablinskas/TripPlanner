import MultipleSelector from "@/components/ui/multiple-selector";
import "./styles/trip-add-traveller.css";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Paths from "@/routes/Paths";
import { ValueSelector } from "@/components/Extra/ValueSelector";
import { PermissionTypes } from "./PermissionTypes";
import { useState } from "react";
import { checkTokenValidity } from "@/utils/jwtUtils";
import { refreshAccessToken } from "@/services/AuthenticationService";
import { toast } from "sonner";
import { useUser } from "@/providers/user-provider/UserContext";
import { inviteTripTravellers } from "@/services/TripTravellersService";
import { CreateEditLoadingButton } from "@/components/Extra/LoadingButton";

const formSchema = z.object({
  invites: z.array(z.any()).nonempty({
    message: "At least one invite must be provided.",
  }),
  permissions: z.string().min(1, {
    message: "Permission is required.",
  }),
  message: z.string().optional(),
});

const TripAddTraveller = () => {
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut } =
    useUser();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invites: [],
      permissions: "",
      message: "",
    },
  });

  const onSubmit = async (values: any) => {
    const formattedValues = {
      ...values,
      invites: values.invites.map((invite: any) => invite.value),
      permissions: Number(values.permissions),
    };

    setIsSubmitting(true);
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

    const response = await inviteTripTravellers(getTripId(), formattedValues);
    if (!response.ok) {
      toast.error("Unexpected error. Try again later", {
        position: "top-center",
      });
      setIsSubmitting(false);
      return;
    }

    toast.success("Invitations were sent to the users!", {
      position: "top-center",
    });
    setIsSubmitting(false);
  };

  const getTripId = () => {
    const path = location.pathname.split("/");
    return path[path.length - 3];
  };

  const mapLocations = [{}];

  return (
    <Form {...form}>
      <form
        className="trip-add-traveller-main-container"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <span
          className="back-to-travellers-list"
          onClick={() =>
            navigate(Paths.TRIP_TRAVELLERS_VIEW.replace(":tripId", getTripId()))
          }
        >
          <ArrowLeft className="mr-2" />
          <p>Back To Trip Participants</p>
        </span>
        <Card className="trip-add-traveller-information-container">
          <CardContent>
            <h1 className="font-bold text-2xl text-center mb-4 pt-6">
              Invite People To Trip
            </h1>
            <FormField
              control={form.control}
              name="invites"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Emails To Invite</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      defaultOptions={field.value}
                      onChange={field.onChange}
                      placeholder="Enter email of person"
                      creatable
                      isEmail
                      createErrorMessage="Email is already selected."
                    />
                  </FormControl>
                  <FormDescription className="!m-0">
                    Invitations will only be sent to the registered users
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="permissions"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Permissions</FormLabel>
                  <FormControl>
                    <ValueSelector
                      value={field.value}
                      setValue={field.onChange}
                      items={PermissionTypes}
                      label="Permissions"
                      placeholder="Select Permissions"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl className="w-full mb-4">
                    <Textarea
                      placeholder="Type your message here."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CreateEditLoadingButton
              className="w-full my-6"
              text="Send Invites"
              loading={isSubmitting}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default TripAddTraveller;
