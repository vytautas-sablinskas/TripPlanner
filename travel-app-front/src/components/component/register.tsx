import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export const Register = () => {
  return (
    <div className="mx-auto space-y-6 max-w-[400px]">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Register</h1>
        <p className="text-gray-500 dark:text-gray-400">Enter your information to create an account</p>
      </div>
      <div className="space-y-4">
      <div className="space-y-2">
          <Label htmlFor="email">Full Name</Label>
          <Input id="name" placeholder="First Last Name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="email@gmail.com" required type="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" required type="password" />
        </div>
        <Button className="w-full bg-primary text-primary-foreground shadow hover:bg-primary/90 bg-black text-white" type="submit">
          Register
        </Button>
        <Separator className="my-8" />
        <Button className="w-full" variant="outline">
          <img
            alt="Google"
            height={24}
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            width={24}
            style={{
              objectFit: "cover",
            }}
            className="mr-2"
          />
          Register with Google
        </Button>
        <div className="mt-4 text-center text-sm">
          Already have an account?
          <Link className="underline ml-1" href="#">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
