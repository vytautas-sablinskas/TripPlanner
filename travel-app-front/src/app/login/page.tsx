"use client"

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useState } from "react";
import { useUser } from "../providers/user-provider/user-context";
import { LoginData, login } from "../api/fetches/auth/AuthenticationRequests";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export type SuccessfulLoginData = {
  accessToken: string;
  refreshToken: string;
}

export const Login = () => {
  const { changeUserInformationToLoggedIn } = useUser();
  const router = useRouter();

  const [formValues, setFormValues] = useState<LoginData>({
    email: "",
    password: ""
  });

  const handleInputChange = (e : any) => {
    const { id, value } = e.target;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [id]: value
    }));
  };

  const handleSubmit = async (e : any) => {
    e.preventDefault();

    try {
      const response = await login(formValues);
      if (response.status == 200) {
          const data = await response.json();
          changeUserInformationToLoggedIn(data.accessToken, data.refreshToken);
          toast.success('Login successful');
      } else {
          console.log(response);
          const responseError = await response.text();
          console.error('Login failed', responseError);
          toast('Fail');
      }
    } catch (error) {
      console.error('Login failed by error', error);
      toast('Fail');
    }
  }

  return (
    <div className="mx-auto space-y-6 max-w-[400px]">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-gray-500 dark:text-gray-400">Enter your information to login</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={formValues.email}
              onChange={handleInputChange}
              placeholder="email@gmail.com"
              type="email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              value={formValues.password}
              onChange={handleInputChange}
              type="password"
              required
            />
          </div>
          <Button
            className="w-full bg-primary text-primary-foreground shadow hover:bg-primary/90 bg-black text-white"
            type="submit"
          >
            Login
          </Button>
          <Separator className="my-8" />
          <div className="mt-4 text-center text-sm">
            Don't have an account?
            <Link className="underline ml-1" href="/register">
              Register
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
