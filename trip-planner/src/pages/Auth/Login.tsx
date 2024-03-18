import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Paths from "../../routes/Paths";
import { toast } from "sonner";
import { login } from "../../api/AuthenticationService";
import { useUser } from "../../providers/user-provider/UserContext";
import { AuthButton } from "@/pages/Auth/AuthButton";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import "./styles/login.css";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/Extra/PasswordInput";

const formSchema = z.object({
  email: z.string(),
  password: z.string()
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { changeUserInformationToLoggedIn } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isValidForm = (formValues : any) => {
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
        password?.length >= minLength &&
        hasUppercase &&
        hasLowercase &&
        hasDigit &&
        hasSpecialChar
      );
    };

    let isError = false;
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
        message: "Password must have at least one lowercase, one uppercase letter, one number, one symbol and at least 6 characters.",
      });
      isError = true;
    }

    return !isError;
  }

  const handleSignIn = async (formValues : any) => {
    if (!isValidForm(formValues)) {
      return;
    }
    
    setLoading(true);
    const response: any = await login(form.getValues());
    const data = response === null ? response : await response.json();

    setLoading(false);
    if (!response?.ok) {
      const message = data?.errorMessage || "Unexpected error. Try again later";
      toast.error(message, {
        position: "top-center",
      });
      return;
    }

    changeUserInformationToLoggedIn(data.accessToken, data.refreshToken);
    navigate(Paths.HOME);
    toast.success("Successfully signed in!", {
      position: "top-center",
    });
  };

  return (
    <Form {...form}>
      <form className="login-container-wrapper" onSubmit={form.handleSubmit(handleSignIn)}>
        <Card>
          <CardContent className="login-container">
            <div className="login-image-container">
              <img 
                src="https://via.placeholder.com/150" 
                alt="Logo" 
                height={72} 
                width={150}
                className="login-image"
              />
            </div>
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Email</FormLabel>
                    <FormControl className="w-full mb-4">
                      <Input placeholder="Enter Your Email" {...field} />
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
                        onChange={(e : any) => field.onChange(e.target.value)}
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AuthButton
                loading={loading}
                text={"Login"}
              />
              <span>Don't have an account yet?<strong className="sing-up-text">Sign Up</strong></span>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default Login;
