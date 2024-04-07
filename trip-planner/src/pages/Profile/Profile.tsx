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

const passwordSchema = z.object({
  oldPassword: z.string().min(1, {
    message: "Current Passwword is required",
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
  email: z.string().min(1, "Email is required.").email({ message: "Please enter a valid email address." }),  
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

  return (
    <div className="account-and-security-main-container">
      <Card className="account-and-security-card">
        <CardContent>
          <Form {...profileForm}>
            <FormLabel className="font-bold text-lg">Personal Information</FormLabel>
            <form onSubmit={profileForm.handleSubmit(console.log)}>
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
              <Button className="mt-4">
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
            <form onSubmit={passwordForm.handleSubmit(console.log)}>
              <FormField
                control={passwordForm.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel required>Current Password</FormLabel>
                    <FormControl className="w-full mb-4">
                      <Input placeholder="Enter Current Password" {...field} />
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
                      <Input placeholder="Enter New Password" {...field} />
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
                      <Input placeholder="Confirm New Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="mt-4">
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
