import { connectToDatabse } from "../db/db.js";

export async function findRoomById(id) {
  const conn = await connectToDatabse();
  try {
    const [rows] = await conn.execute(
      "SELECT id, hostel_id, room_number, capacity FROM room WHERE id = ?",
      [id]
    );
    return rows[0];
  } finally {
    conn.release();
  }
}

export async function findRoomsByHostel(hostel_id) {
  const conn = await connectToDatabse();
  try {
    const [rows] = await conn.execute(
      "SELECT id, hostel_id, room_number, capacity FROM room WHERE hostel_id = ?",
      [hostel_id]
    );
    return rows;
  } finally {
    conn.release();
  }
}

export async function findRoomByNumber(hostel_id, room_number) {
  const conn = await connectToDatabse();
  try {
    const [rows] = await conn.execute(
      "SELECT id, hostel_id, room_number, capacity FROM room WHERE hostel_id = ? AND room_number = ?",
      [hostel_id, room_number]
    );
    return rows[0];
  } finally {
    conn.release();
  }
}

export async function createRoom({ hostel_id, room_number, capacity = 1 }) {
  const conn = await connectToDatabse();
  try {
    const [result] = await conn.execute(
      "INSERT INTO room (hostel_id, room_number, capacity) VALUES (?, ?, ?)",
      [hostel_id, room_number, capacity]
    );
    const [rows] = await conn.execute(
      "SELECT id, hostel_id, room_number, capacity FROM room WHERE id = ?",
      [result.insertId]
    );
    return rows[0];
  } finally {
    conn.release();
  }
}
