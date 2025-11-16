import { Router } from 'express'
import { allocateFromApplication, getAllocationsForStudent } from '../controllers/allocation.controller.js'

const router = Router()

// POST /admin/allocate
router.post('/allocate', allocateFromApplication)

// GET /admin/allocations/:student_id
router.get('/allocations/:student_id', getAllocationsForStudent)

export default router
