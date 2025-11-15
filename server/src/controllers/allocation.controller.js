import asyncHandler from '../utils/asynchandler.js'
import { ApiError } from '../utils/apiError.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { findApplicationById, updateApplicationStatus } from '../models/applications.model.js'
import { createAllocation, findAllocationsByStudent } from '../models/allocation.model.js'

// Admin: allocate a room for a student's application
const allocateFromApplication = asyncHandler(async (req, res) => {
  const { application_id, room_id } = req.body
  if (!application_id || !room_id) throw new ApiError(400, 'application_id and room_id are required')

  const application = await findApplicationById(application_id)
  if (!application) throw new ApiError(404, 'Application not found')

  if (application.status && application.status.toUpperCase() !== 'PENDING') {
    throw new ApiError(400, 'Application is not pending')
  }

//   console.log(1);
  
  
  // create allocation using student_id from application
  const allocation = await createAllocation({ student_id: application.student_id, room_id })
//   console.log(1);
  
  // update application status to ALLOCATED
  await updateApplicationStatus(application_id, 'APPROVED')
//   console.log(1);

  return res.status(201).json(new ApiResponse(201, { allocation }, 'Room allocated'))
})

const getAllocationsForStudent = asyncHandler(async (req, res) => {
  const { student_id } = req.params
  if (!student_id) throw new ApiError(400, 'student_id required')
  const allocations = await findAllocationsByStudent(student_id)
  return res.status(200).json(new ApiResponse(200, { allocations }, 'OK'))
})

export { allocateFromApplication, getAllocationsForStudent }
