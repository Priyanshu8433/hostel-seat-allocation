import asyncHandler from '../utils/asynchandler.js'
import { ApiError } from '../utils/apiError.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { createComplaint, findComplaintsByStudent, findComplaintById, updateComplaintStatus } from '../models/complaint.model.js'
import { findUserByEmail, findUserByUsername } from '../models/user.model.js'

const submitComplaint = asyncHandler(async (req, res) => {
    const { student_id, description } = req.body
    if (!student_id) throw new ApiError(400, 'student_id is required')
    if (!description || String(description).trim() === '') throw new ApiError(400, 'description is required')

    console.log(1);
    
    
    // try resolve student id
    let studentIdNumeric = null
    const byEmail = await findUserByEmail(student_id)
    if (byEmail) studentIdNumeric = byEmail.id
    else if (!isNaN(Number(student_id))) studentIdNumeric = Number(student_id)
        else {
    const byUsername = await findUserByUsername(student_id)
    if (byUsername) studentIdNumeric = byUsername.id
}
console.log(1);

if (!studentIdNumeric) throw new ApiError(404, 'Student not found')
    
    const complaint = await createComplaint({ student_id: studentIdNumeric, description })
    return res.status(201).json(new ApiResponse(201, { complaint }, 'Complaint submitted'))
})

const getStudentComplaints = asyncHandler(async (req, res) => {
    const { student_id } = req.params
    if (!student_id) throw new ApiError(400, 'student_id required')
        const complaints = await findComplaintsByStudent(student_id)
    return res.status(200).json(new ApiResponse(200, { complaints }, 'OK'))
})

const changeComplaintStatus = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { status } = req.body
    if (!id) throw new ApiError(400, 'complaint id required')
    if (!status) throw new ApiError(400, 'status is required')

    console.log('changeComplaintStatus: requested id =>', id)
    const existing = await findComplaintById(id)
    console.log('changeComplaintStatus: db lookup result =>', existing)
    if (!existing) throw new ApiError(404, 'Complaint not found')

    const updated = await updateComplaintStatus(id, status)
    return res.status(200).json(new ApiResponse(200, { complaint: updated }, 'Status updated'))
})

export { submitComplaint, getStudentComplaints, changeComplaintStatus }
