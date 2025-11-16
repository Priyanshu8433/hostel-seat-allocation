import { Router } from "express";
import {
  getAllApplications,
  getAllComplaints,
  getAllUsers,
  getAllHostels,
  getAllRooms,
  updateApplication,
  updateComplaint,
} from "../controllers/admin.controller.js";

const router = Router();

// Admin routes for fetching all data
router.get("/applications", getAllApplications);
router.get("/complaints", getAllComplaints);
router.get("/users", getAllUsers);
router.get("/hostels", getAllHostels);
router.get("/rooms", getAllRooms);

// Admin routes for updating data
router.patch("/applications/:id", updateApplication);
router.patch("/complaints/:id", updateComplaint);

export default router;
