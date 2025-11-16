import asyncHandler from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { connectToDatabse } from "../db/db.js";

async function resolveTable(conn, candidates = []) {
  if (!candidates || candidates.length === 0) return null;
  const placeholders = candidates.map(() => "?").join(",");
  const [rows] = await conn.execute(
    `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME IN (${placeholders})`,
    [process.env.DB_NAME, ...candidates]
  );
  if (rows && rows.length > 0) return rows[0].TABLE_NAME;
  return null;
}

const getStats = asyncHandler(async (req, res) => {
  const conn = await connectToDatabse();

  // total students
  const [studentsRows] = await conn.execute(
    `SELECT COUNT(*) AS total_students FROM users WHERE role = 'STUDENT'`
  );
  const total_students = studentsRows[0]?.total_students || 0;

  // open complaints (not RESOLVED)
  const [complaintsRows] = await conn.execute(
    `SELECT COUNT(*) AS open_complaints FROM complaints WHERE status != 'RESOLVED'`
  );
  const open_complaints = complaintsRows[0]?.open_complaints || 0;

  // pending applications
  const [appsRows] = await conn.execute(
    `SELECT COUNT(*) AS pending_applications FROM applications WHERE status = 'PENDING'`
  );
  const pending_applications = appsRows[0]?.pending_applications || 0;

  // total beds (sum of room capacity)
  const [bedsRows] = await conn.execute(
    `SELECT COALESCE(SUM(capacity), 0) AS total_beds FROM rooms`
  );

  let total_beds = bedsRows[0]?.total_beds || 0;
  if (total_beds === 0) {
    const [bedsRows2] = await conn.execute(
      `SELECT COALESCE(SUM(capacity), 0) AS total_beds FROM rooms`
    );
    total_beds = bedsRows2[0]?.total_beds || 0;
  }

  // allocated beds

  const [allocRows] = await conn.execute(
    `SELECT COUNT(*) AS allocated_beds FROM allocations`
  );
  let allocated_beds = allocRows[0]?.allocated_beds || 0;
  if (allocated_beds === 0) {
    const [allocRows2] = await conn.execute(
      `SELECT COUNT(*) AS allocated_beds FROM allocation`
    );
    allocated_beds = allocRows2[0]?.allocated_beds || 0;
  }

  const available_beds = Math.max(0, total_beds - allocated_beds);

  const data = {
    total_students,
    open_complaints,
    pending_applications,
    total_beds,
    allocated_beds,
    available_beds,
  };

  return res.status(200).json(new ApiResponse(200, { stats: data }, "OK"));
});

const getStudentsByRoom = asyncHandler(async (req, res) => {
  const { room_id } = req.params;
  if (!room_id) throw new ApiError(400, "room_id is required");

  const conn = await connectToDatabse();
  const [rows] = await conn.execute(
    `SELECT u.id AS student_id, u.username, u.email, u.full_name, u.graduation_year, a.id AS allocation_id, a.room_id, a.allocated_at
         FROM allocations a
         JOIN users u ON u.id = a.student_id
         WHERE a.room_id = ? AND u.role = 'STUDENT'`,
    [room_id]
  );

  return res.status(200).json(new ApiResponse(200, { students: rows }, "OK"));
});

const getHostelStats = asyncHandler(async (req, res) => {
  const { hostel_id } = req.params;
  if (!hostel_id) throw new ApiError(400, "hostel_id is required");

  const conn = await connectToDatabse();

  // resolve table names in case the DB uses pluralized names
  const hostelTable =
    (await resolveTable(conn, ["hostel", "hostels"])) || "hostel";
  const roomTable = (await resolveTable(conn, ["room", "rooms"])) || "room";
  const allocationsTable =
    (await resolveTable(conn, ["allocations", "allocation"])) || "allocations";
  const complaintsTable =
    (await resolveTable(conn, ["complaints", "complaint"])) || "complaints";

  const [hostelRows] = await conn.execute(
    "SELECT id, name FROM `" + hostelTable + "` WHERE id = ?",
    [hostel_id]
  );
  const hostel = hostelRows[0];
  if (!hostel) throw new ApiError(404, "Hostel not found");

  const [bedsRows] = await conn.execute(
    "SELECT COALESCE(SUM(capacity),0) AS total_beds FROM `" +
      roomTable +
      "` WHERE hostel_id = ?",
    [hostel_id]
  );
  const total_beds = bedsRows[0]?.total_beds || 0;

  const [allocRows] = await conn.execute(
    "SELECT COUNT(*) AS allocated_beds FROM `" +
      allocationsTable +
      "` a JOIN `" +
      roomTable +
      "` r ON a.room_id = r.id WHERE r.hostel_id = ?",
    [hostel_id]
  );
  const allocated_beds = allocRows[0]?.allocated_beds || 0;

  const [studentsRows] = await conn.execute(
    "SELECT COUNT(DISTINCT a.student_id) AS total_students FROM `" +
      allocationsTable +
      "` a JOIN `" +
      roomTable +
      "` r ON a.room_id = r.id WHERE r.hostel_id = ?",
    [hostel_id]
  );
  const total_students = studentsRows[0]?.total_students || 0;

  const [complRows] = await conn.execute(
    "SELECT COUNT(*) AS open_complaints FROM `" +
      complaintsTable +
      "` c JOIN `" +
      allocationsTable +
      "` a ON c.student_id = a.student_id JOIN `" +
      roomTable +
      "` r ON a.room_id = r.id WHERE r.hostel_id = ? AND c.status != 'RESOLVED'",
    [hostel_id]
  );
  const open_complaints = complRows[0]?.open_complaints || 0;

  let warden_name = null;
  try {
    const [col] = await conn.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = 'warden_name'`,
      [process.env.DB_NAME, hostelTable]
    );
    if (col && col.length > 0) {
      const [wRows] = await conn.execute(
        "SELECT warden_name FROM `" + hostelTable + "` WHERE id = ?",
        [hostel_id]
      );
      warden_name = wRows[0]?.warden_name || null;
    }
  } catch (err) {
    warden_name = null;
  }

  const data = {
    hostel: { id: hostel.id, name: hostel.name, warden_name },
    total_beds,
    allocated_beds,
    available_beds: Math.max(0, total_beds - allocated_beds),
    total_students,
    open_complaints,
  };

  return res.status(200).json(new ApiResponse(200, { stats: data }, "OK"));
});

export { getStats, getStudentsByRoom, getHostelStats };
