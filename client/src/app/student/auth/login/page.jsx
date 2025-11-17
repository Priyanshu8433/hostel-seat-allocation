"use client";

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
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      if (res?.token) {
        router.push("/student/dashboard/overview");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError(err?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

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
            Student Login
          </CardTitle>
          <CardDescription className="text-center">
            Please enter your credentials to login.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Link href="#" className="text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between -mt-4">
          <p className="mx-auto">
            Don&apos;t have an account?{" "}
            <Link
              href="/student/auth/signup"
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

export default Page;
