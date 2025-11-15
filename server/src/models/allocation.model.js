import { connectToDatabse } from '../db/db.js'

export async function createAllocation({ student_id, room_id }) {
  const conn = await connectToDatabse()
  const [result] = await conn.execute(
    'INSERT INTO allocations (student_id, room_id) VALUES (?, ?)',
    [student_id, room_id]
  )
  const [rows] = await conn.execute('SELECT * FROM allocations WHERE id = ?', [result.insertId])
  return rows[0]
}

export async function findAllocationsByStudent(student_id) {
  const conn = await connectToDatabse()
  const [rows] = await conn.execute('SELECT * FROM allocations WHERE student_id = ?', [student_id])
  return rows
}

export async function findAllocationsByRoom(room_id) {
  const conn = await connectToDatabse()
  const [rows] = await conn.execute('SELECT * FROM allocations WHERE room_id = ?', [room_id])
  return rows
}

export async function findAllocationById(id) {
  const conn = await connectToDatabse()
  const [rows] = await conn.execute('SELECT * FROM allocations WHERE id = ?', [id])
  return rows[0]
}

