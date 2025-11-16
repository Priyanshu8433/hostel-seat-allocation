"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/common/Buttons/button";
import { Separator } from "@/components/common/Separator/separator";
import { Plus, Search } from "lucide-react";
import RoomCard from "@/components/common/Cards/RoomCard";
import { Input } from "@/components/common/InputBox/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/Select/select";
import { api } from "@/lib/api";

const Page = () => {
  const [rooms, setRooms] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [hostelFilter, setHostelFilter] = useState("all");
  const [capacityFilter, setCapacityFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsData, hostelsData] = await Promise.all([
          api.getRooms(),
          api.getHostels(),
        ]);
        console.log("Rooms from backend:", roomsData);
        console.log("Hostels from backend:", hostelsData);

        setRooms(roomsData?.data?.rooms || roomsData?.rooms || []);
        setHostels(hostelsData?.data?.hostels || hostelsData?.hostels || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter rooms
  const filteredRooms = rooms.filter((room) => {
    // Search filter - includes room number, ID, and tenant names
    const matchesSearch =
      room.room_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.id.toString().includes(searchQuery) ||
      room.tenants?.some((tenant) =>
        tenant.toLowerCase().includes(searchQuery.toLowerCase())
      );

    // Hostel filter
    const matchesHostel =
      hostelFilter === "all" || room.hostel_id.toString() === hostelFilter;

    // Capacity filter
    const matchesCapacity =
      capacityFilter === "all" || room.capacity.toString() === capacityFilter;

    return matchesSearch && matchesHostel && matchesCapacity;
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
      <div className="flex justify-between mb-3 items-center">
        <div className="flex flex-col">
          <span className="text-3xl font-extrabold text-foreground">Rooms</span>
          <span className="font-medium text-muted-foreground text-lg">
            Manage room information and availability
          </span>
        </div>
        <Button className="w-36 rounded-none p-6 font-medium">
          <Plus className="size-5" /> Add Room
        </Button>
      </div>

      <Separator className="mb-5" />

      {/* Search and Filters */}
      <div className="mb-6 grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 max-w-6xl">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by room number, ID, or tenant name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
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

        <Select value={capacityFilter} onValueChange={setCapacityFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Capacity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Capacity</SelectItem>
            <SelectItem value="1">1 Person</SelectItem>
            <SelectItem value="2">2 Person</SelectItem>
            <SelectItem value="3">3 Person</SelectItem>
            <SelectItem value="4">4 Person</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearchQuery("");
            setHostelFilter("all");
            setCapacityFilter("all");
          }}
          className="h-9"
        >
          Clear Filters
        </Button>

        <div className="text-sm text-muted-foreground">
          Showing {filteredRooms.length} of {rooms.length} rooms
        </div>
      </div>

      {/* Content */}
      <div className="mx-40">
        <div className="w-full grid grid-cols-[1fr_1fr_2fr_1fr_1fr] text-center bg-primary/30 py-4 font-semibold mb-6">
          <span>Room No.</span>
          <span>Available/Capacity</span>
          <span>Tenant Names</span>
          <span> Occupancy Status</span>
        </div>
        <div className="flex flex-col gap-2">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <div key={room.id}>
                <RoomCard room={room} />
                <Separator />
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {rooms.length === 0
                ? "No rooms available"
                : "No rooms found matching your filters."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
