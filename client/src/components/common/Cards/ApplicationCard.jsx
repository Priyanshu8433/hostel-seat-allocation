import React from "react";
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
import { users, hostels, rooms } from "@/data/mock_data";

const ApplicationCard = ({ application }) => {
  // Get related data
  const student = users.find((u) => u.id === application.student_id);
  const hostel = hostels.find((h) => h.id === application.hostel_id);
  const room = rooms.find((r) => r.id === application.room_id);

  // Format date
  const formattedDate = new Date(application.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  // Status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-50 border-green-200";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      default:
        return null;
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
            {application.status}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Student</span>
              <span className="font-medium">{student?.full_name || "N/A"}</span>
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
              <span className="font-medium">{hostel?.name || "N/A"}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <DoorOpen className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Room</span>
              <span className="font-medium">{room?.room_number || "N/A"}</span>
            </div>
          </div>
        </div>

        {application.status === "pending" && (
          <div className="flex gap-2 pt-2">
            <Button size="sm" className="flex-1">
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button size="sm" variant="destructive" className="flex-1">
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;
