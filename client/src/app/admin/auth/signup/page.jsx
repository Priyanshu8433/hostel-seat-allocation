import { Button } from "@/components/common/Buttons/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/common/Cards/card";
import { Input } from "@/components/common/InputBox/input";
import { Label } from "@/components/common/Labels/label";
import Link from "next/link";

const page = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <Card className="w-96 flex flex-col gap-8 z-9999">
        <CardHeader>
          <CardTitle className="text-4xl font-black text-center">
            Admin Signup
          </CardTitle>
          <CardDescription className="text-center">
            Please enter your credentials to signup.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" placeholder="Email" className="" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input type="password" placeholder="Password" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input type="password" placeholder="Confirm Password" />
          </div>
          <Button>Signup</Button>
        </CardContent>
        <CardFooter className="flex justify-between -mt-4">
          <p className="mx-auto">
            Already have an account?{" "}
            <Link
              href="/admin/auth/login"
              className="text-primary hover:underline"
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
