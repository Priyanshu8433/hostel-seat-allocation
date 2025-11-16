import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "../Buttons/button";
import {
  Calendar,
  User,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { users } from "@/data/mock_data";

const ComplaintCard = ({ complaint }) => {
  // Get student data
  const student = users.find((u) => u.id === complaint.student_id);

  // Format date
  const formattedDate = new Date(complaint.created_at).toLocaleDateString(
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
      case "resolved":
        return "text-green-600 bg-green-50 border-green-200";
      case "open":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "resolved":
        return <CheckCircle2 className="h-4 w-4" />;
      case "open":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow shadow-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Complaint #{complaint.id}
          </CardTitle>
          <span
            className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 capitalize ${getStatusStyle(
              complaint.status
            )}`}
          >
            {getStatusIcon(complaint.status)}
            {complaint.status}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm text-foreground">{complaint.description}</p>
        </div>

        <div className="flex gap-4 pt-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">
                Submitted by
              </span>
              <span className="font-medium">{student?.full_name || "N/A"}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Date</span>
              <span className="font-medium">{formattedDate}</span>
            </div>
          </div>
        </div>

        {complaint.status === "open" && (
          <div className="pt-2">
            <Button size="sm" className="w-full">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Mark as Resolved
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComplaintCard;
