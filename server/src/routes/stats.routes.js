import express from 'express'
import { getStats, getStudentsByRoom, getHostelStats } from '../controllers/stats.controller.js'

const router = express.Router()
//get total stats
router.get('/', getStats)
//list students allocated to a room
router.get('/room/:room_id/students', getStudentsByRoom)

// per-hostel aggregated stats
router.get('/hostel/:hostel_id', getHostelStats)

export default router
