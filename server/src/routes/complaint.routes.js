import { Router } from 'express'
import { submitComplaint, getStudentComplaints, changeComplaintStatus } from '../controllers/complaint.controller.js'

const router = Router()

// submit a complaint
router.post('/', submitComplaint)

// list complaints for a student
router.get('/:student_id', getStudentComplaints)

// update complaint status
router.patch('/:id/status', changeComplaintStatus)

export default router
