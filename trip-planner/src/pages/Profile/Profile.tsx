import { Card, CardContent } from "@/components/ui/card";
import "./styles/account-and-security.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useUser } from "@/providers/user-provider/UserContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { checkTokenValidity } from "@/utils/jwtUtils";
import { refreshAccessToken } from "@/api/AuthenticationService";
import Paths from "@/routes/Paths";
import { changePassword, changeProfileInformation, getUserProfile } from "@/api/ProfileService";
import PasswordInput from "@/components/Extra/PasswordInput";

const passwordSchema = z.object({
  oldPassword: z.string().min(1, {
    message: "Current Password is required",
  }),
  newPassword: z.string().min(1, {
    message: "New Password is required.",
  }),
  confirmPassword: z.string().min(1, {
    message: "Confirming Password is required.",
  }),
});

const profileSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  surname: z.string().min(1, {
    message: "Surname is required.",
  }),
  email: z
    .string()
    .min(1, "Email is required.")
    .email({ message: "Please enter a valid email address." }),
});

const Profile = () => {
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
    },
  });

  const { changeUserInformationToLoggedOut, changeUserInformationToLoggedIn } =
    useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const tryFetchingUserInformation = async () => {
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
          result.data.refreshToken
        );
      }

      const response = await getUserProfile();
      if (!response.ok) {
        toast.error("Unexpected error. Try refreshing page", {
          position: "top-center",
        });
        setIsSubmitting(false);
        return;
      }

      const data = await response.json();
      profileForm.setValue("name", data.name);
      profileForm.setValue("surname", data.surname);
      profileForm.setValue("email", data.email);
      setIsSubmitting(false);
    };

    tryFetchingUserInformation();
  }, []);

  const onChangePersonalInfromation = async (formValues: any) => {
    console.log(formValues);

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
        result.data.refreshToken
      );
    }

    const response = await changeProfileInformation(formValues);
    if (!response.ok) {
      toast.error("Unexpected error. Try again later!", {
        position: "top-center",
      });
      setIsSubmitting(false);
      return;
    }

    toast.success("Personal information changed successfully", {
      position: "top-center",
    }
    )
    setIsSubmitting(false);
  }

  const onChangePassword = async (formValues: any) => {
    const isValidPassword = (password: string) => {
      const minLength = 6;
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasDigit = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      return (
        password.length >= minLength &&
        hasUppercase &&
        hasLowercase &&
        hasDigit &&
        hasSpecialChar
      );
    };

    if (formValues.newPassword !== formValues.confirmPassword) {
      passwordForm.setError("confirmPassword", {
        message: "Passwords do not match.",
      });
    }

    if (!isValidPassword(formValues.newPassword)) {
      passwordForm.setError("newPassword", {
        message:
          "Password must have at least one lowercase, one uppercase letter, one number, one symbol and at least 6 characters.",
      });
    }

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
        result.data.refreshToken
      );
    }

    const dto = {
      currentPassword: formValues.oldPassword,
      newPassword: formValues.newPassword,
    };
    const response = await changePassword(dto);
    console.log(response);
    if (!response.ok) {
      const message = await response.text();
      toast.error(message, {
        position: "top-center",
      });
      setIsSubmitting(false);
      return;
    }

    toast.success("Password changed successfully", {
      position: "top-center",
    });
    setIsSubmitting(false);
  };

  return (
    <div className="account-and-security-main-container">
      <Card className="account-and-security-card">
        <CardContent>
          <Form {...profileForm}>
            <FormLabel className="font-bold text-lg">
              Personal Information
            </FormLabel>
            <form onSubmit={profileForm.handleSubmit(onChangePersonalInfromation)}>
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel required>Name</FormLabel>
                    <FormControl className="w-full mb-4">
                      <Input placeholder="Enter Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="surname"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel required>Surname</FormLabel>
                    <FormControl className="w-full mb-4">
                      <Input placeholder="Enter Surname" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel required>Email</FormLabel>
                    <FormControl className="w-full mb-4">
                      <Input placeholder="Enter Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="mt-4" disabled={isSubmitting}>
                Change Personal Information
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="account-and-security-card">
        <CardContent>
          <Form {...passwordForm}>
            <FormLabel className="font-bold text-lg">Change password</FormLabel>
            <form onSubmit={passwordForm.handleSubmit(onChangePassword)}>
              <FormField
                control={passwordForm.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel required>Current Password</FormLabel>
                    <FormControl className="w-full mb-4">
                      <PasswordInput
                        placeholder="Enter Current Password"
                        value={field.value}
                        onChange={(e: any) => field.onChange(e.target.value)}
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel required>New Password</FormLabel>
                    <FormControl className="w-full mb-4">
                      <PasswordInput
                        placeholder="Enter New Password"
                        value={field.value}
                        onChange={(e: any) => field.onChange(e.target.value)}
                        autoComplete="new-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel required>Confirm New Password</FormLabel>
                    <FormControl className="w-full mb-4">
                      <PasswordInput
                        placeholder="Confirm New Password"
                        value={field.value}
                        onChange={(e: any) => field.onChange(e.target.value)}
                        autoComplete="confirm-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="mt-4" disabled={isSubmitting} type="submit">
                Change Password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
