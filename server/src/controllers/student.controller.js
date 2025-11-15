import asyncHandler from '../utils/asynchandler.js'
import { ApiError } from '../utils/apiError.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { createApplication, findApplicationsByStudent } from '../models/applications.model.js'
import { findUserByEmail, findUserByUsername } from '../models/user.model.js'

const applyForHostel = asyncHandler(async (req, res) => {
    const { student_id, hostel_id, message } = req.body

    if (!student_id) {
        throw new ApiError(400, 'student_id is required')
    }

    // optional: check student exists
    const student = await findUserByEmail(student_id) // allow passing email OR id
    let studentIdNumeric = null
    if (student) {
        studentIdNumeric = student.id
    } else if (!isNaN(Number(student_id))) {
        studentIdNumeric = Number(student_id)
    } else {
        // try username
        const byUsername = await findUserByUsername(student_id)
        if (byUsername) studentIdNumeric = byUsername.id
    }

    if (!studentIdNumeric) {
        throw new ApiError(404, 'Student not found')
    }

    const application = await createApplication({ student_id: studentIdNumeric, hostel_id, message })
    return res.status(201).json(new ApiResponse(201, { application }, 'Application submitted'))
})

const getMyApplications = asyncHandler(async (req, res) => {
    const { student_id } = req.params
    if (!student_id) throw new ApiError(400, 'student_id required')
    const apps = await findApplicationsByStudent(student_id)
    return res.status(200).json(new ApiResponse(200, { applications: apps }, 'OK'))
})

export { applyForHostel, getMyApplications }
