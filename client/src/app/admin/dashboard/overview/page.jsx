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
import {
  applications,
  complaints,
  users,
  hostels,
  statistics,
} from "@/data/mock_data";
import { Separator } from "@/components/common/Separator/separator";
import AppStatus from "@/components/common/Labels/AppStatus";
import Link from "next/link";

const page = () => {
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
      <div className="flex gap-4 mb-6">
        <div className="flex-1 grid grid-cols-2 gap-4">
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
            value={statistics.total_beds - statistics.allocated_beds}
          />
        </div>
        <div className="flex-1">Charts come here</div>
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
                    <AppStatus text={app.status} variant={app.status} />
                  </div>
                );
              })}
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
                const statusVariant = {
                  open: "pending",
                  resolved: "approved",
                };
                return (
                  <div
                    key={comp.id}
                    className="grid grid-cols-[1fr_2fr_1fr_4fr] gap-4 text-center mb-2 items-center"
                  >
                    <span>{comp.id}</span>
                    <span>
                      {student ? student.full_name : "Unknown Student"}
                    </span>
                    <AppStatus
                      text={comp.status}
                      variant={statusVariant[comp.status]}
                    />
                    <span className="truncate block w-full text-left">
                      {comp.description}
                    </span>
                  </div>
                );
              })}
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

export default page;
