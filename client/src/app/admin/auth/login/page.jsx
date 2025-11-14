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
import Image from "next/image";

const page = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      {/* <Image
        src="/assets/vector/building_1.svg"
        alt="Logo"
        width={800}
        height={800}
        className="absolute left-46 bottom-4 opacity-20"
      /> */}
      <Card className="w-96 flex flex-col gap-8 z-9999">
        <CardHeader>
          <CardTitle className="text-4xl font-black text-center">
            Signup
          </CardTitle>
          <CardDescription className="text-center">
            Please enter your credentials to login.
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
            <Link href="#" className="text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button>Login</Button>
        </CardContent>
        <CardFooter className="flex justify-between -mt-4">
          <p className="mx-auto">
            Don&apos;t have an account?{" "}
            <Link
              href="/admin/auth/signup"
              className="text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
