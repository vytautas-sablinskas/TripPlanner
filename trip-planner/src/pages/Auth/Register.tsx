import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Paths from "../../routes/Paths";
import { toast } from "sonner";
import { register } from "../../api/AuthenticationService";
import { AuthButton } from "./AuthButton";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/Extra/PasswordInput";
import { Card, CardContent } from "@/components/ui/card";
import "./styles/login.css";

const formSchema = z.object({
  name: z.string(),
  surname: z.string(),
  email: z.string(),
  password: z.string(),
});

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
    },
  });

  const isValidForm = (formValues: any) => {
    const isValidName = (nameOrSurname: string) => {
      return nameOrSurname.length > 0;
    };

    const isValidEmail = (email: string) => {
      const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return re.test(String(email).toLowerCase());
    };

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

    let isError = false;
    if (!isValidName(formValues.name)) {
      form.setError("name", {
        type: "manual",
        message: "Name is required.",
      });
      isError = true;
    }

    if (!isValidName(formValues.surname)) {
      form.setError("surname", {
        type: "manual",
        message: "Surname is required.",
      });
      isError = true;
    }
    if (!isValidEmail(formValues.email)) {
      form.setError("email", {
        type: "manual",
        message: "Invalid email format.",
      });
      isError = true;
    }

    if (!isValidPassword(formValues.password)) {
      form.setError("password", {
        type: "manual",
        message:
          "Password must have at least one lowercase, one uppercase letter, one number, one symbol and at least 6 characters.",
      });
      isError = true;
    }

    return !isError;
  };

  const handleSignUp = async (formValues: any) => {
    if (!isValidForm(formValues)) {
      return;
    }

    setLoading(true);
    const response: any = await register(formValues);
    setLoading(false);

    if (!response?.ok) {
      const data = response ?? (await response.json());
      const message = data.errorMessage || "Unexpected error. Try again later";
      toast.error(message, {
        position: "top-center",
      });
      return;
    }

    navigate(Paths.HOME);
    toast.success("Successfully signed up!", {
      position: "top-center",
    });
  };

  return (
    <Form {...form}>
      <form
        className="login-container-wrapper"
        onSubmit={form.handleSubmit(handleSignUp)}
      >
        <Card>
          <CardContent className="login-container">
            <div className="login-image-container">
              <img
                src="/logo.png"
                alt="Logo"
                height={72}
                width={150}
                className="h-[150px]"
              />
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Name</FormLabel>
                  <FormControl className="w-full mb-4">
                    <Input placeholder="Enter Your Name" {...field} autoComplete="given-name"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Surname</FormLabel>
                  <FormControl className="w-full mb-4">
                    <Input placeholder="Enter Your Surname" {...field} autoComplete="family-name"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Email</FormLabel>
                  <FormControl className="w-full mb-4">
                    <Input placeholder="Enter Your Email" {...field} autoComplete="email"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Password</FormLabel>
                  <FormControl className="w-full">
                    <PasswordInput
                      value={field.value}
                      onChange={(e: any) => field.onChange(e.target.value)}
                      autoComplete="current-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AuthButton loading={loading} text={"Register"} />
            <span className="wrong-section-text">
              Already have an account?<strong className="sing-up-text" onClick={() => navigate(Paths.LOGIN)}>Log in</strong>
            </span>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default Register;
