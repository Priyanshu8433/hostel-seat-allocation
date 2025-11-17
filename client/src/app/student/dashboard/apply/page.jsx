"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/common/Cards/card";
import { Button } from "@/components/common/Buttons/button";
import { Input } from "@/components/common/InputBox/input";
import { Label } from "@/components/common/Labels/label";
import { api } from "@/lib/api";

const Page = () => {
  const [hostels, setHostels] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState("");
  const [message, setMessage] = useState("");
  const [roomPreference, setRoomPreference] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [applications, setApplications] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchHostels();
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) fetchApplications();
  }, [user]);

  const fetchHostels = async () => {
    try {
      const res = await api.getHostels();
      setHostels(res?.data?.hostels || res?.hostels || []);
    } catch {}
  };

  const fetchUser = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    }
  };

  const fetchApplications = async () => {
    try {
      if (!user) return;
      const res = await api.getStudentApplications(user.id);
      setApplications(res?.data?.applications || res?.applications || []);
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!selectedHostel) {
      setError("Please select a hostel.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.submitApplication({
        student_id: user.id,
        hostel_id: selectedHostel,
        message,
        room_preference: roomPreference,
      });
      setSuccess("Application submitted!");
      setMessage("");
      setSelectedHostel("");
      setRoomPreference("");
      fetchApplications();
    } catch (err) {
      setError(err?.message || "Failed to submit application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Apply for Hostel</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="hostel">Select Hostel</Label>
            <select
              id="hostel"
              value={selectedHostel}
              onChange={(e) => setSelectedHostel(e.target.value)}
              className="border rounded px-3 py-2"
              required
            >
              <option value="">-- Select Hostel --</option>
              {hostels.map((hostel) => (
                <option key={hostel.id} value={hostel.id}>
                  {hostel.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="message">Message (optional)</Label>
            <Input
              id="message"
              placeholder="Any special request?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="room_preference">Room Preference (optional)</Label>
            <Input
              id="room_preference"
              placeholder="e.g. Room 101, 2nd Floor, etc."
              value={roomPreference}
              onChange={(e) => setRoomPreference(e.target.value)}
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Apply"}
          </Button>
        </form>
      </Card>
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Your Recent Applications</h2>
        {applications.length === 0 ? (
          <div className="text-muted-foreground">No applications found.</div>
        ) : (
          <ul className="space-y-3">
            {applications.map((app) => (
              <li
                key={app.id}
                className="border rounded p-3 flex flex-col gap-1"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Hostel:</span>{" "}
                  {app.hostel_name || app.hostel_id}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Status:</span>
                  <span className="capitalize px-2 py-1 rounded text-xs border">
                    {app.status
                      ?.toLowerCase()
                      .split("_")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ")}
                  </span>
                </div>
                {app.message && (
                  <div className="text-xs text-muted-foreground">
                    Message: {app.message}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default Page;
