"use client";

import { useState, useEffect } from "react";
import ApplicationCard from "@/components/common/Cards/ApplicationCard";
import { Separator } from "@/components/common/Separator/separator";
import { Input } from "@/components/common/InputBox/input";
import { Button } from "@/components/common/Buttons/button";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/Select/select";
import { api } from "@/lib/api";

const Page = () => {
  const [applications, setApplications] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [hostelFilter, setHostelFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appsData, hostelsData] = await Promise.all([
        api.getAllApplications(),
        api.getHostels(),
      ]);
      console.log("Applications from backend:", appsData);
      console.log("Hostels from backend:", hostelsData);

      setApplications(
        appsData?.data?.applications || appsData?.applications || []
      );
      setHostels(hostelsData?.data?.hostels || hostelsData?.hostels || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter applications
  const filteredApplications = applications.filter((application) => {
    // Search filter - data now includes student info directly
    const matchesSearch =
      application.full_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      application.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.id.toString().includes(searchQuery);

    // Status filter - handle both uppercase and lowercase
    const appStatus = application.status?.toLowerCase();
    const matchesStatus = statusFilter === "all" || appStatus === statusFilter;

    // Hostel filter
    const matchesHostel =
      hostelFilter === "all" ||
      application.hostel_id?.toString() === hostelFilter;

    return matchesSearch && matchesStatus && matchesHostel;
  });

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
          Applications
        </span>
        <span className="font-medium text-muted-foreground text-lg">
          Manage Application status
        </span>
      </div>

      <Separator className="mb-5" />

      {/* Search and Filters */}
      <div className="mb-6 grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 max-w-6xl">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by student name, email, or application ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select value={hostelFilter} onValueChange={setHostelFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Hostel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Hostels</SelectItem>
            {hostels.map((hostel) => (
              <SelectItem key={hostel.id} value={hostel.id.toString()}>
                {hostel.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearchQuery("");
            setStatusFilter("all");
            setHostelFilter("all");
          }}
          className="h-9"
        >
          Clear Filters
        </Button>

        <div className="text-sm text-muted-foreground">
          Showing {filteredApplications.length} of {applications.length}{" "}
          applications
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-3 gap-4">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onStatusUpdate={fetchData}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-12 text-muted-foreground">
            No applications found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
