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
    //update using id
    const [rowsById] = await conn.execute(`SELECT * FROM complaints WHERE id = ?`, [id])
    if (rowsById && rowsById.length > 0) return rowsById[0]

    //update using student_id
    const [rowsByStudent] = await conn.execute(
        `SELECT * FROM complaints WHERE student_id = ? ORDER BY created_at DESC LIMIT 1`,
        [id]
    )
    return rowsByStudent[0]
}

export async function updateComplaintStatus(id, status) {
    const conn = await connectToDatabse()
    //update using id
    const [result] = await conn.execute(`UPDATE complaints SET status = ? WHERE id = ?`, [status, id])
    if (result && result.affectedRows && result.affectedRows > 0) {
        const [rows] = await conn.execute(`SELECT * FROM complaints WHERE id = ?`, [id])
        return rows[0]
    }

    //update using student_id
    const [latest] = await conn.execute(
        `SELECT id FROM complaints WHERE student_id = ? ORDER BY created_at DESC LIMIT 1`,
        [id]
    )
    if (!latest || latest.length === 0) return null
    const complaintId = latest[0].id
    await conn.execute(`UPDATE complaints SET status = ? WHERE id = ?`, [status, complaintId])
    const [rowsByStudent] = await conn.execute(`SELECT * FROM complaints WHERE id = ?`, [complaintId])
    return rowsByStudent[0]
}
