"use client";

import { useState } from "react";
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
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { token, user } = await api.login({ email, password });

      // Check if user is admin
      if (user.role !== "ADMIN") {
        setError("Access denied. Admin credentials required.");
        api.logout();
        return;
      }

      // Redirect to dashboard
      router.push("/admin/dashboard/overview");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <Card className="w-96 flex flex-col gap-8 z-9999">
        <CardHeader>
          <CardTitle className="text-4xl font-black text-center">
            Admin Login
          </CardTitle>
          <CardDescription className="text-center">
            Please enter your credentials to login.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="flex flex-col gap-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <Link href="#" className="text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </CardContent>
        </form>
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

export default Page;
