import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "../Buttons/button";
import {
  Calendar,
  Building2,
  DoorOpen,
  User,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { api } from "@/lib/api";

const ApplicationCard = ({ application, onStatusUpdate }) => {
  const [loading, setLoading] = useState(false);
  // Data is now included in the application object from backend
  const studentName = application.full_name || application.username || "N/A";
  const hostelName = application.hostel_name || "N/A";

  // Format date - backend might not have created_at, use current date as fallback
  const formattedDate = "Recent"; // Backend doesn't return application date

  // Status styling - handle both uppercase and lowercase
  const getStatusStyle = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "approved":
        return "text-green-600 bg-green-50 border-green-200";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200";
      case "pending":
      case "in_progress":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "pending":
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Format status for display
  const statusDisplay = application.status
    ?.toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const handleStatusUpdate = async (status) => {
    setLoading(true);
    try {
      await api.updateApplicationStatus(application.id, status);
      // Call parent callback to refresh data
      if (onStatusUpdate) {
        onStatusUpdate();
      }
    } catch (error) {
      console.error("Failed to update application status:", error);
      alert("Failed to update application status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">
            Application #{application.id}
          </CardTitle>
          <span
            className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 capitalize ${getStatusStyle(
              application.status
            )}`}
          >
            {getStatusIcon(application.status)}
            {statusDisplay}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Student</span>
              <span className="font-medium">{studentName}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Applied On</span>
              <span className="font-medium">{formattedDate}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Hostel</span>
              <span className="font-medium">{hostelName}</span>
            </div>
          </div>
          {application.message && (
            <div className="col-span-2 flex items-start gap-2 text-sm">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Message</span>
                <span className="font-medium text-sm">
                  {application.message}
                </span>
              </div>
            </div>
          )}
        </div>

        {application.status?.toLowerCase() === "pending" && (
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              className="flex-1"
              onClick={() => handleStatusUpdate("APPROVED")}
              disabled={loading}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              {loading ? "Processing..." : "Approve"}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="flex-1"
              onClick={() => handleStatusUpdate("REJECTED")}
              disabled={loading}
            >
              <XCircle className="h-4 w-4 mr-1" />
              {loading ? "Processing..." : "Reject"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;
