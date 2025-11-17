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
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      !fullName ||
      !graduationYear
    ) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      // Call backend signup API (adjust endpoint as needed)
      const res = await api.register({
        username,
        email,
        password,
        full_name: fullName,
        graduation_year: graduationYear,
      });
      if (res?.success || res?.status === 201) {
        setSuccess("Signup successful! Redirecting to login...");
        setTimeout(() => router.push("/student/auth/login"), 1500);
      } else {
        setError(res?.message || "Signup failed. Try again.");
      }
    } catch (err) {
      setError(err?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <Card className="w-96 flex flex-col gap-8 z-9999">
        <CardHeader>
          <CardTitle className="text-4xl font-black text-center">
            Student Signup
          </CardTitle>
          <CardDescription className="text-center">
            Please enter your credentials to signup.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="graduation_year">Graduation Year</Label>
              <Input
                type="number"
                placeholder="Graduation Year (e.g. 2026)"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                min="2020"
                max="2100"
                required
              />
            </div>
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
              <Label htmlFor="username">Username</Label>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
            <Button type="submit" disabled={loading}>
              {loading ? "Signing up..." : "Signup"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between -mt-4">
          <p className="mx-auto">
            Already have an account?{" "}
            <Link
              href="/student/auth/login"
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

export default Page;
