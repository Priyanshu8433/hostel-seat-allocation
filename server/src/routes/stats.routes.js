import express from 'express'
import { getStats, getStudentsByRoom } from '../controllers/stats.controller.js'

const router = express.Router()

router.get('/', getStats)
// GET /room/:room_id/students -> list students allocated to a room
router.get('/room/:room_id/students', getStudentsByRoom)

export default router
