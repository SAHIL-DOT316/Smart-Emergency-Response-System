import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import {
  createEmergencyRequest,
  getAllEmergencyRequests,
  assignDriver,
  getDriverRequests,
} from "../controllers/emergencyController.js";

const router = express.Router();

router.post(
  "/request",
  authMiddleware,
  createEmergencyRequest
);

router.get("/", getAllEmergencyRequests);
router.put("/assign-driver", assignDriver);
router.get(
  "/driver",
  authMiddleware,
  getDriverRequests
);

export default router;