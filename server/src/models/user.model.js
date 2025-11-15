import { connectToDatabse } from '../db/db.js'

export async function findUserByEmail(email) {
	const conn = await connectToDatabse()
	const [rows] = await conn.execute('SELECT * FROM users WHERE email = ?', [email])
	return rows[0]
}

export async function findUserByUsername(username) {
	const conn = await connectToDatabse()
	const [rows] = await conn.execute('SELECT * FROM users WHERE username = ?', [username])
	return rows[0]
}

export async function createUser({ username, email, password, full_name, role = 'STUDENT', graduation_year = null }) {
	const conn = await connectToDatabse()
	const [result] = await conn.execute(
		`INSERT INTO users (username, email, password, full_name, role, graduation_year)
		VALUES (?, ?, ?, ?, ?, ?)`,
		[username, email, password, full_name, role, graduation_year]
	)
	return { id: result.insertId, username, email, full_name, role, graduation_year }
}
