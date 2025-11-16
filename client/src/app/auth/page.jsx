"use client";

import { Button } from "@/components/common/Buttons/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/common/Cards/card";
import { ArrowRight, GraduationCap, ShieldUser } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex w-2xl">
        <Card className="bg-primary border-r-0 rounded-r-none flex-1">
          <CardHeader>
            <ShieldUser
              size={84}
              strokeWidth={1.5}
              className="mx-auto text-secondary"
            />
            <CardTitle className="text-secondary text-3xl font-bold text-center">
              Admin
            </CardTitle>
            <CardDescription className="text-muted text-center">
              For cheif warden, warden and staff
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/auth/login">
              <Button variant="outline" className="border-none">
                Admin Login <ArrowRight />
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="bg-secondary border-l-0 rounded-l-none flex-1">
          <CardHeader>
            <GraduationCap size={84} strokeWidth={1.5} className="mx-auto" />
            <CardTitle className="text-3xl font-bold text-center">
              Student
            </CardTitle>
            <CardDescription className="text-center">
              For students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/student/auth/login">
              <Button>
                Student Login <ArrowRight />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
