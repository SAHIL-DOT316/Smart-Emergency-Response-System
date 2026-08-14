import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  updateHospitalLocation,
   updateHospitalBeds,
} from "../controllers/hospitalController.js";

const router = express.Router();


// =========================================
// UPDATE LOCATION
// =========================================

router.put(
  "/location",
  authMiddleware,
  updateHospitalLocation
);
router.put(
  "/beds",
  authMiddleware,
  updateHospitalBeds
);

export default router;