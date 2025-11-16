import asyncHandler from '../utils/asynchandler.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { ApiError } from '../utils/apiError.js'
import { connectToDatabse } from '../db/db.js'

const getStats = asyncHandler(async (req, res) => {
    const conn = await connectToDatabse()

    // total students
    const [studentsRows] = await conn.execute(`SELECT COUNT(*) AS total_students FROM users WHERE role = 'STUDENT'`)
    const total_students = studentsRows[0]?.total_students || 0

    // open complaints (not RESOLVED)
    const [complaintsRows] = await conn.execute(`SELECT COUNT(*) AS open_complaints FROM complaints WHERE status != 'RESOLVED'`)
    const open_complaints = complaintsRows[0]?.open_complaints || 0

    // pending applications
    const [appsRows] = await conn.execute(`SELECT COUNT(*) AS pending_applications FROM applications WHERE status = 'PENDING'`)
    const pending_applications = appsRows[0]?.pending_applications || 0

    // total beds (sum of room capacity)
    const [bedsRows] = await conn.execute(`SELECT COALESCE(SUM(capacity), 0) AS total_beds FROM rooms`)

    let total_beds = bedsRows[0]?.total_beds || 0
    if (total_beds === 0) {
        const [bedsRows2] = await conn.execute(`SELECT COALESCE(SUM(capacity), 0) AS total_beds FROM rooms`)
        total_beds = bedsRows2[0]?.total_beds || 0
    }

    // allocated beds

    const [allocRows] = await conn.execute(`SELECT COUNT(*) AS allocated_beds FROM allocations`)
    let allocated_beds = allocRows[0]?.allocated_beds || 0
    if (allocated_beds === 0) {
        const [allocRows2] = await conn.execute(`SELECT COUNT(*) AS allocated_beds FROM allocation`)
        allocated_beds = allocRows2[0]?.allocated_beds || 0
    }

    const available_beds = Math.max(0, total_beds - allocated_beds)

    const data = {
        total_students,
        open_complaints,
        pending_applications,
        total_beds,
        allocated_beds,
        available_beds,
    }

    return res.status(200).json(new ApiResponse(200, { stats: data }, 'OK'))
})


const getStudentsByRoom = asyncHandler(async (req, res) => {
    const { room_id } = req.params
    if (!room_id) throw new ApiError(400, 'room_id is required')

    const conn = await connectToDatabse()
    const [rows] = await conn.execute(
        `SELECT u.id AS student_id, u.username, u.email, u.full_name, u.graduation_year, a.id AS allocation_id, a.room_id, a.allocated_at
         FROM allocations a
         JOIN users u ON u.id = a.student_id
         WHERE a.room_id = ? AND u.role = 'STUDENT'`,
        [room_id]
    )

    return res.status(200).json(new ApiResponse(200, { students: rows }, 'OK'))
})

export { getStats, getStudentsByRoom }
