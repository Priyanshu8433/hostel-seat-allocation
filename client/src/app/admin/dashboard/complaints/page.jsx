"use client";

import { useState, useEffect } from "react";
import ComplaintCard from "@/components/common/Cards/ComplaintCard";
import { Separator } from "@/components/common/Separator/separator";
import { Input } from "@/components/common/InputBox/input";
import { Button } from "@/components/common/Buttons/button";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/Select/select";
import { api } from "@/lib/api";

const Page = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const complaintsData = await api.getAllComplaints();
      console.log("Complaints from backend:", complaintsData);
      setComplaints(
        complaintsData?.data?.complaints || complaintsData?.complaints || []
      );
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter complaints
  const filteredComplaints = complaints.filter((complaint) => {
    // Search filter - backend includes student info directly
    const matchesSearch =
      complaint.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.description
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      complaint.id.toString().includes(searchQuery);

    // Status filter - handle uppercase from backend
    const complaintStatus = complaint.status?.toLowerCase();
    const matchesStatus =
      statusFilter === "all" || complaintStatus === statusFilter;

    return matchesSearch && matchesStatus;
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
          Complaints
        </span>
        <span className="font-medium text-muted-foreground text-lg">
          Manage complaint information and status
        </span>
      </div>

      <Separator className="mb-5" />

      {/* Search and Filters */}
      <div className="mb-6 grid grid-cols-[2fr_1fr_1fr] gap-4 max-w-6xl">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by student name, description, or complaint ID..."
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
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearchQuery("");
            setStatusFilter("all");
          }}
          className="h-9"
        >
          Clear Filters
        </Button>

        <div className="text-sm text-muted-foreground">
          Showing {filteredComplaints.length} of {complaints.length} complaints
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-2 gap-4">
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              onStatusUpdate={fetchData}
            />
          ))
        ) : (
          <div className="col-span-2 text-center py-12 text-muted-foreground">
            No complaints found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
