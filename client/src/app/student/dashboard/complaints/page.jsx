"use client";

import React, { useEffect, useState, server } from "react";
import { Card } from "@/components/common/Cards/card";
import { Button } from "@/components/common/Buttons/button";
import { Input } from "@/components/common/InputBox/input";
import { Label } from "@/components/common/Labels/label";
import { api } from "@/lib/api";

const Page = () => {
  const [complaint, setComplaint] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) fetchComplaints();
  }, [user]);

  const fetchUser = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    }
  };

  const fetchComplaints = async () => {
    try {
      if (!user) return;
      const res = await api.getStudentComplaints(user.id);
      setComplaints(res?.data?.complaints || res?.complaints || []);
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!complaint.trim()) {
      setError("Please enter your complaint.");
      return;
    }
    setLoading(true);
    try {
      await api.submitComplaint({
        student_id: user.id,
        description: complaint,
      });
      setSuccess("Complaint submitted!");
      setComplaint("");
      fetchComplaints();
    } catch (err) {
      setError(err?.message || "Failed to submit complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Raise a Complaint</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="complaint">Complaint</Label>
            <Input
              id="complaint"
              placeholder="Describe your issue..."
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Complaint"}
          </Button>
        </form>
      </Card>
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Your Recent Complaints</h2>
        {complaints.length === 0 ? (
          <div className="text-muted-foreground">No complaints found.</div>
        ) : (
          <ul className="space-y-3">
            {complaints.map((c) => (
              <li key={c.id} className="border rounded p-3 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Status:</span>
                  <span className="capitalize px-2 py-1 rounded text-xs border">
                    {c.status
                      ?.toLowerCase()
                      .split("_")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ")}
                  </span>
                </div>
                <div className="text-sm">{c.description}</div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default Page;
