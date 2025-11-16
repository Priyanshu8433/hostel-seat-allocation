import { Router } from 'express'
import { applyForHostel, getMyApplications } from '../controllers/student.controller.js'

const router = Router()

// POST /student/apply
router.post('/apply', applyForHostel)

// GET /student/:student_id/applications
router.get('/:student_id/applications', getMyApplications)

export default router
