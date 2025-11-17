"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/common/Cards/card";
import { api } from "@/lib/api";
import {
  Home,
  DoorOpen,
  Inbox,
  AlertCircle,
  CheckCircle2,
  User,
} from "lucide-react";

const statusColors = {
  approved: "text-green-600 bg-green-50 border-green-200",
  pending: "text-yellow-600 bg-yellow-50 border-yellow-200",
  rejected: "text-red-600 bg-red-50 border-red-200",
  open: "text-orange-600 bg-orange-50 border-orange-200",
  resolved: "text-green-600 bg-green-50 border-green-200",
  in_progress: "text-blue-600 bg-blue-50 border-blue-200",
};

const statusIcons = {
  approved: <CheckCircle2 className="h-4 w-4" />,
  pending: <Inbox className="h-4 w-4" />,
  rejected: <AlertCircle className="h-4 w-4" />,
  open: <AlertCircle className="h-4 w-4" />,
  resolved: <CheckCircle2 className="h-4 w-4" />,
  in_progress: <Inbox className="h-4 w-4" />,
};

function formatStatus(status) {
  return status
    ?.toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const Page = () => {
  const [user, setUser] = useState(null);
  const [allocation, setAllocation] = useState(null);
  const [application, setApplication] = useState(null);
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get user from localStorage (or use api.getCurrentUser if available)
      let userData = null;
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("user");
        if (stored) userData = JSON.parse(stored);
      }
      setUser(userData);
      if (!userData) {
        setLoading(false);
        return;
      }
      // Fetch allocation, latest application, latest complaint
      const [allocRes, appsRes, compRes] = await Promise.all([
        api.getMyAllocation?.(),
        api.getStudentApplications(userData.id),
        api.getStudentComplaints(userData.id),
      ]);
      setAllocation(allocRes?.data?.allocation || allocRes?.allocation || null);
      setApplication(
        appsRes?.data?.applications?.[0] || appsRes?.applications?.[0] || null
      );
      setComplaint(
        compRes?.data?.complaints?.[0] || compRes?.complaints?.[0] || null
      );
    } catch (e) {
      // fallback: do nothing
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-extrabold mb-2">
        Welcome{user?.full_name ? `, ${user.full_name}` : ""}!
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Allotted Room Card */}
        <Card className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2">
            <DoorOpen className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg">Allotted Room</span>
          </div>
          {allocation ? (
            <>
              <div className="text-sm">
                Room <b>{allocation.room_number}</b> in Hostel{" "}
                <b>{allocation.hostel_name}</b>
              </div>
              <div className="text-xs text-muted-foreground">
                Capacity: {allocation.capacity}, Room ID: {allocation.room_id}
              </div>
            </>
          ) : (
            <div className="text-muted-foreground text-sm">
              No room allotted yet.
            </div>
          )}
        </Card>
        {/* Application Status Card */}
        <Card className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2">
            <Inbox className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg">Latest Application</span>
          </div>
          {application ? (
            <>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 capitalize ${
                    statusColors[application.status?.toLowerCase()]
                  }`}
                >
                  {statusIcons[application.status?.toLowerCase()]}
                  {formatStatus(application.status)}
                </span>
                <span className="text-sm">
                  Hostel: <b>{application.hostel_name}</b>
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Message: {application.message || "-"}
              </div>
            </>
          ) : (
            <div className="text-muted-foreground text-sm">
              No application found.
            </div>
          )}
        </Card>
        {/* Complaint Status Card */}
        <Card className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg">Latest Complaint</span>
          </div>
          {complaint ? (
            <>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 capitalize ${
                    statusColors[complaint.status?.toLowerCase()]
                  }`}
                >
                  {statusIcons[complaint.status?.toLowerCase()]}
                  {formatStatus(complaint.status)}
                </span>
                <span className="text-sm">{complaint.description}</span>
              </div>
            </>
          ) : (
            <div className="text-muted-foreground text-sm">
              No complaints found.
            </div>
          )}
        </Card>
        {/* Student Info Card */}
        <Card className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg">Your Info</span>
          </div>
          <div className="text-sm">
            Name: <b>{user?.full_name || "-"}</b>
          </div>
          <div className="text-sm">
            Email: <b>{user?.email || "-"}</b>
          </div>
          <div className="text-sm">
            Username: <b>{user?.username || "-"}</b>
          </div>
          <div className="text-sm">
            Graduation Year: <b>{user?.graduation_year || "-"}</b>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Page;
