"use client";

import { useState } from "react";
import ComplaintCard from "@/components/common/Cards/ComplaintCard";
import { Separator } from "@/components/common/Separator/separator";
import { complaints, users } from "@/data/mock_data";
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

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter complaints
  const filteredComplaints = complaints.filter((complaint) => {
    const student = users.find((u) => u.id === complaint.student_id);

    // Search filter
    const matchesSearch =
      student?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.id.toString().includes(searchQuery);

    // Status filter
    const matchesStatus =
      statusFilter === "all" || complaint.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
            <ComplaintCard key={complaint.id} complaint={complaint} />
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
