import { connectToDatabse } from '../db/db.js'

export async function findHostelById(id) {
  const conn = await connectToDatabse()
  const [rows] = await conn.execute('SELECT id, name FROM hostel WHERE id = ?', [id])
  return rows[0]
}

export async function findHostelByName(name) {
  const conn = await connectToDatabse()
  const [rows] = await conn.execute('SELECT id, name FROM hostel WHERE name = ?', [name])
  return rows[0]
}

export async function listHostels() {
  const conn = await connectToDatabse()
  const [rows] = await conn.execute('SELECT id, name FROM hostel')
  return rows
}

export async function createHostel({ name }) {
  const conn = await connectToDatabse()
  const [result] = await conn.execute(
    'INSERT INTO hostel (name) VALUES (?)',
    [name]
  )
  const [rows] = await conn.execute('SELECT id, name FROM hostel WHERE id = ?', [result.insertId])
  return rows[0]
}
