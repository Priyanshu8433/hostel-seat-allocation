import { connectToDatabse } from '../db/db.js'

export async function createApplication({ student_id, hostel_id = null, message = null, status = 'PENDING' }) {
    const conn = await connectToDatabse()
    const [result] = await conn.execute(
        `INSERT INTO applications (student_id, hostel_id, message, status)
         VALUES (?, ?, ?, ?)`,
        [student_id, hostel_id, message, status]
    )
    // fetch the full inserted row so we can include database-generated fields like created_at
    const [rows] = await conn.execute(`SELECT * FROM applications WHERE id = ?`, [result.insertId])
    return rows[0]
}

export async function findApplicationsByStudent(student_id) {
    const conn = await connectToDatabse()
    const [rows] = await conn.execute(
        `SELECT * FROM applications WHERE student_id = ?`,
        [student_id]
    )
    return rows
}

export async function findApplicationById(id) {
    const conn = await connectToDatabse()
    const [rows] = await conn.execute(`SELECT * FROM applications WHERE id = ?`, [id])
    return rows[0]
}

export async function updateApplicationStatus(id, status) {
    const conn = await connectToDatabse()
    await conn.execute(`UPDATE applications SET status = ? WHERE id = ?`, [status, id])
    const [rows] = await conn.execute(`SELECT * FROM applications WHERE id = ?`, [id])
    return rows[0]
}
