import asyncHandler from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { connectToDatabse } from "../db/db.js";
import { updateApplicationStatus } from "../models/applications.model.js";
import { updateComplaintStatus } from "../models/complaint.model.js";

// Get all applications with student and hostel details
const getAllApplications = asyncHandler(async (req, res) => {
  const conn = await connectToDatabse();

  const [rows] = await conn.execute(
    `SELECT 
      a.id,
      a.student_id,
      a.hostel_id,
      a.status,
      a.message,
      u.username,
      u.email,
      u.full_name,
      h.name AS hostel_name
    FROM applications a
    LEFT JOIN users u ON a.student_id = u.id
    LEFT JOIN hostel h ON a.hostel_id = h.id
    ORDER BY a.id DESC`
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { applications: rows }, "OK"));
});

// Get all complaints with student details
const getAllComplaints = asyncHandler(async (req, res) => {
  const conn = await connectToDatabse();

  const [rows] = await conn.execute(
    `SELECT 
      c.id,
      c.student_id,
      c.description,
      c.status,
      u.username,
      u.email,
      u.full_name
    FROM complaints c
    LEFT JOIN users u ON c.student_id = u.id
    ORDER BY c.id DESC`
  );

  return res.status(200).json(new ApiResponse(200, { complaints: rows }, "OK"));
});

// Get all users (or filter by role)
const getAllUsers = asyncHandler(async (req, res) => {
  const conn = await connectToDatabse();
  const { role } = req.query;

  let query = `SELECT id, username, email, full_name, role, graduation_year FROM users`;
  let params = [];

  if (role) {
    query += ` WHERE role = ?`;
    params.push(role);
  }

  query += ` ORDER BY id DESC`;

  const [rows] = await conn.execute(query, params);

  return res.status(200).json(new ApiResponse(200, { users: rows }, "OK"));
});

// Get all hostels with room details
const getAllHostels = asyncHandler(async (req, res) => {
  const conn = await connectToDatabse();

  const [rows] = await conn.execute(
    `SELECT 
      h.id,
      h.name,
      h.warden_name,
      COUNT(DISTINCT r.id) AS total_rooms,
      COALESCE(SUM(r.capacity), 0) AS total_capacity,
      COALESCE(COUNT(DISTINCT a.id), 0) AS occupied_beds
    FROM hostel h
    LEFT JOIN rooms r ON h.id = r.hostel_id
    LEFT JOIN allocations a ON r.id = a.room_id
    GROUP BY h.id, h.name, h.warden_name
    ORDER BY h.name`
  );

  return res.status(200).json(new ApiResponse(200, { hostels: rows }, "OK"));
});

// Get all rooms with hostel and tenant details
const getAllRooms = asyncHandler(async (req, res) => {
  const conn = await connectToDatabse();

  const [rooms] = await conn.execute(
    `SELECT 
      r.id,
      r.hostel_id,
      r.room_number,
      r.capacity,
      h.name AS hostel_name,
      COUNT(DISTINCT a.id) AS occupied_beds
    FROM rooms r
    LEFT JOIN hostel h ON r.hostel_id = h.id
    LEFT JOIN allocations a ON r.id = a.room_id
    GROUP BY r.id, r.hostel_id, r.room_number, r.capacity, h.name
    ORDER BY h.name, r.room_number`
  );

  // Get tenant names for each room
  const roomsWithTenants = await Promise.all(
    rooms.map(async (room) => {
      const [tenants] = await conn.execute(
        `SELECT u.full_name
        FROM allocations a
        JOIN users u ON a.student_id = u.id
        WHERE a.room_id = ?`,
        [room.id]
      );
      return {
        ...room,
        tenants: tenants.map((t) => t.full_name),
        available_beds: room.capacity - room.occupied_beds,
      };
    })
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { rooms: roomsWithTenants }, "OK"));
});

// Update application status (approve/reject)
const updateApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id) throw new ApiError(400, "Application ID is required");
  if (!status) throw new ApiError(400, "Status is required");

  // Validate status
  const validStatuses = ["PENDING", "APPROVED", "REJECTED", "IN_PROGRESS"];
  if (!validStatuses.includes(status.toUpperCase())) {
    throw new ApiError(400, "Invalid status");
  }

  const updatedApplication = await updateApplicationStatus(
    id,
    status.toUpperCase()
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { application: updatedApplication },
        "Application status updated"
      )
    );
});

// Update complaint status (admin)
const updateComplaint = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate status
  const validStatuses = ["OPEN", "RESOLVED", "IN_PROGRESS"];
  if (!status || !validStatuses.includes(status.toUpperCase())) {
    throw new ApiError(
      400,
      "Invalid status. Must be OPEN, RESOLVED, or IN_PROGRESS"
    );
  }

  const updatedComplaint = await updateComplaintStatus(
    id,
    status.toUpperCase()
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { complaint: updatedComplaint },
        "Complaint status updated"
      )
    );
});

export {
  getAllApplications,
  getAllComplaints,
  getAllUsers,
  getAllHostels,
  getAllRooms,
  updateApplication,
  updateComplaint,
};
