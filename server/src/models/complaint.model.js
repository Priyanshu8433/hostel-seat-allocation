import { connectToDatabse } from '../db/db.js'

export async function createComplaint({ student_id, description = null, status = 'PENDING' }) {
    const conn = await connectToDatabse()
    const [result] = await conn.execute(
        `INSERT INTO complaints (student_id, description, status)
         VALUES (?, ?, ?)`,
        [student_id, description, status]
    )
    const [rows] = await conn.execute(`SELECT * FROM complaints WHERE id = ?`, [result.insertId])
    return rows[0]
}

export async function findComplaintsByStudent(student_id) {
    const conn = await connectToDatabse()
    const [rows] = await conn.execute(
        `SELECT * FROM complaints WHERE student_id = ? ORDER BY created_at DESC`,
        [student_id]
    )
    return rows
}

export async function findComplaintById(id) {
    const conn = await connectToDatabse()
    const [rows] = await conn.execute(`SELECT * FROM complaints WHERE id = ?`, [id])
    return rows[0]
}

export async function updateComplaintStatus(id, status) {
    const conn = await connectToDatabse()
    await conn.execute(`UPDATE complaints SET status = ? WHERE id = ?`, [status, id])
    const [rows] = await conn.execute(`SELECT * FROM complaints WHERE id = ?`, [id])
    return rows[0]
}
