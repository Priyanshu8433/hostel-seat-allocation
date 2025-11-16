import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "../Buttons/button";
import {
  Calendar,
  User,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { api } from "@/lib/api";

const ComplaintCard = ({ complaint, onStatusUpdate }) => {
  const [loading, setLoading] = useState(false);

  // Data is now included in the complaint object from backend
  const studentName = complaint.full_name || complaint.username || "N/A";

  // Format date - backend might not return created_at
  const formattedDate = complaint.created_at
    ? new Date(complaint.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Recent";

  // Status styling - handle both uppercase and lowercase
  const getStatusStyle = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "resolved":
        return "text-green-600 bg-green-50 border-green-200";
      case "open":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "in_progress":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "resolved":
        return <CheckCircle2 className="h-4 w-4" />;
      case "open":
        return <AlertCircle className="h-4 w-4" />;
      case "in_progress":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Format status for display
  const statusDisplay = complaint.status
    ?.toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const handleResolve = async () => {
    setLoading(true);
    try {
      await api.updateComplaintStatus(complaint.id, "RESOLVED");
      // Call parent callback to refresh data
      if (onStatusUpdate) {
        onStatusUpdate();
      }
    } catch (error) {
      console.error("Failed to resolve complaint:", error);
      alert("Failed to resolve complaint. Please try again.");
    } finally {
      setLoading(false);
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
            {statusDisplay}
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
              <span className="font-medium">{studentName}</span>
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

        {complaint.status?.toLowerCase() === "open" && (
          <div className="pt-2">
            <Button
              size="sm"
              className="w-full"
              onClick={handleResolve}
              disabled={loading}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              {loading ? "Processing..." : "Mark as Resolved"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComplaintCard;
