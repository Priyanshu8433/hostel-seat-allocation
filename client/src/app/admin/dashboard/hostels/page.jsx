"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/common/Buttons/button";
import { Separator } from "@/components/common/Separator/separator";
import { Plus } from "lucide-react";
import HostelCard from "@/components/common/Cards/HostelCard";
import { api } from "@/lib/api";

const Page = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const data = await api.getHostels();
        console.log("Hostels from backend:", data);
        setHostels(data?.data?.hostels || data?.hostels || []);
      } catch (error) {
        console.error("Error fetching hostels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHostels();
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
      <div className="flex justify-between mb-3 items-center">
        <div className="flex flex-col">
          <span className="text-3xl font-extrabold text-foreground">
            Hostels
          </span>
          <span className="font-medium text-muted-foreground text-lg">
            Manage hostel information and availability
          </span>
        </div>
        <Button className="w-36 rounded-none p-6 font-medium">
          <Plus className="size-5" /> Add Hostel
        </Button>
      </div>

      <Separator className="mb-5" />

      {/* Content */}
      <div className="flex gap-8 mb-5">
        <div className="font-semibold flex gap-2 items-center">
          <div className="h-4 w-4 bg-primary" />
          <span>: Available Beds</span>
        </div>
        <div className="font-semibold flex gap-2 items-center">
          <div className="h-4 w-4 bg-destructive/70" />
          <span>: Occupied Beds</span>
        </div>
      </div>

      {hostels.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No hostels found
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {hostels.map((hostel) => (
            <HostelCard key={hostel.id} hostel={hostel} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
