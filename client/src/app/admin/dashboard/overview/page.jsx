"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/common/Cards/card";
import StatCard from "@/components/common/Cards/StatCard";
import {
  Users,
  StickyNote,
  BadgeAlert,
  BedSingle,
  ChevronsRight,
} from "lucide-react";
import { Separator } from "@/components/common/Separator/separator";
import AppStatus from "@/components/common/Labels/AppStatus";
import Link from "next/link";
import { api } from "@/lib/api";

const statusVariants = {
  IN_PROGRESS: "pending",
  pending: "pending",
};

const Page = () => {
  const [statistics, setStatistics] = useState({
    total_students: 0,
    open_complaints: 0,
    pending_applications: 0,
    total_beds: 0,
    allocated_beds: 0,
    available_beds: 0,
  });
  const [applications, setApplications] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [stats, appsData, complaintsData, usersData, hostelsData] =
          await Promise.all([
            api.getAdminStats(),
            api.getAllApplications(),
            api.getAllComplaints(),
            api.getUsers(),
            api.getHostels(),
          ]);

        console.log("Stats from backend:", stats);
        console.log("Applications:", appsData);
        console.log("Complaints:", complaintsData);
        console.log("Users:", usersData);
        console.log("Hostels:", hostelsData);

        // Stats is already extracted by the API utility
        setStatistics(stats);
        // Extract arrays from the data object
        setApplications(
          appsData?.data?.applications || appsData?.applications || []
        );
        setComplaints(
          complaintsData?.data?.complaints || complaintsData?.complaints || []
        );
        setUsers(usersData?.data?.users || usersData?.users || []);
        setHostels(hostelsData?.data?.hostels || hostelsData?.hostels || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col mb-3">
        <span className="text-3xl font-extrabold text-foreground">
          Admin Dashboard
        </span>
        <span className="font-medium text-muted-foreground text-lg">
          Overview of Hostel Seat Allocation
        </span>
      </div>

      <Separator className="mb-5" />

      {/* Stat Cards */}
      <div className="flex-1 grid grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Students"
          description="Number of students enrolled"
          icon={Users}
          value={statistics.total_students}
        />
        <StatCard
          title="Pending Applications"
          description="Number of applications pending review"
          icon={StickyNote}
          value={statistics.pending_applications}
        />
        <StatCard
          title="Open Complaints"
          description="Number of open complaints"
          icon={BadgeAlert}
          value={statistics.open_complaints}
        />
        <StatCard
          title="Available Seats"
          description="Number of available seats"
          icon={BedSingle}
          value={
            statistics.available_beds ||
            statistics.total_beds - statistics.allocated_beds
          }
        />
      </div>

      {/* Content */}
      <div className="flex gap-6">
        {/* Recent Applications */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-lg">Recent Applications</CardTitle>
            <CardDescription>Latest hostel seat applications</CardDescription>
            <Separator />
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="grid grid-cols-[1fr_1.5fr_2fr_2fr_1fr] gap-4 bg-chart-2/20 py-2 mb-4 font-semibold text-center -mt-4">
                <span>App. ID</span>
                <span>Student ID</span>
                <span>Student name</span>
                <span>Hostel name</span>
                <span>Status</span>
              </div>
              {applications.slice(0, 5).map((app) => {
                const student = users.find((u) => u.id === app.student_id);
                const hostel = hostels.find((h) => h.id === app.hostel_id);
                const statusLower = app.status?.toLowerCase();
                // Convert to title case: "IN_PROGRESS" -> "In Progress"
                const statusDisplay = app.status
                  ?.toLowerCase()
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ");
                return (
                  <div
                    key={app.id}
                    className="grid grid-cols-[1fr_1.5fr_2fr_2fr_1fr] gap-4 text-center mb-2 items-center"
                  >
                    <span>{app.id}</span>
                    <span>{student ? student.id : "Unknown Student"}</span>
                    <span>
                      {student ? student.full_name : "Unknown Student"}
                    </span>
                    <span>{hostel ? hostel.name : "Unknown Hostel"}</span>
                    <AppStatus text={statusDisplay} variant={statusLower} />
                  </div>
                );
              })}
              {applications.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No applications found
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Link
                href="/admin/dashboard/applications"
                className="flex items-center gap-1 text-primary hover:underline font-medium"
              >
                Manage All <ChevronsRight />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Open Complaints */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-lg">Recent Complaints</CardTitle>
            <CardDescription>Complaints raised by students</CardDescription>
            <Separator />
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="grid grid-cols-[1fr_2fr_1fr_4fr] bg-chart-3/40 gap-4 py-2 mb-4 font-semibold text-center -mt-4">
                <span>ID</span>
                <span>Raised by</span>
                <span>Status</span>
                <span>Description</span>
              </div>
              {complaints.slice(0, 5).map((comp) => {
                const student = users.find((u) => u.id === comp.student_id);
                const statusLower = comp.status?.toLowerCase();
                const statusVariant =
                  statusLower === "open" ||
                  statusLower === "pending" ||
                  statusLower === "in_progress"
                    ? "pending"
                    : statusLower === "resolved"
                    ? "approved"
                    : statusLower;
                return (
                  <div
                    key={comp.id}
                    className="grid grid-cols-[1fr_2fr_1fr_4fr] gap-4 text-center mb-2 items-center"
                  >
                    <span>{comp.id}</span>
                    <span>
                      {student ? student.full_name : "Unknown Student"}
                    </span>
                    <AppStatus text={statusVariant} variant={statusVariant} />
                    <span className="truncate block w-full text-left">
                      {comp.description}
                    </span>
                  </div>
                );
              })}
              {complaints.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No complaints found
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Link
                href="/admin/dashboard/complaints"
                className="flex items-center gap-1 text-primary hover:underline font-medium"
              >
                Resolve All <ChevronsRight />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
