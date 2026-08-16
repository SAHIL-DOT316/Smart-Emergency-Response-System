import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import {
  createEmergencyRequest,
  getAllEmergencyRequests,
   getMyEmergencyRequests,
    getAvailableDrivers,
     getNearestDrivers,
  assignDriver,
  getDriverRequests,
  updateEmergencyStatus,
  getNearestHospitals,
   getHospitalRequests,
   acceptHospitalEmergency,
rejectHospitalEmergency,
assignHospital,
} from "../controllers/emergencyController.js";

const router = express.Router();

router.post(
  "/request",
  authMiddleware,
  createEmergencyRequest
);
router.get(
  "/my-requests",
  authMiddleware,
  getMyEmergencyRequests
);
router.get(
  "/available-drivers",
  authMiddleware,
  getAvailableDrivers
);
router.get(
  "/nearest-drivers/:requestId",
  authMiddleware,
  getNearestDrivers
);
router.get("/", getAllEmergencyRequests);

router.put("/assign-driver", assignDriver);
router.get(
  "/driver",
  authMiddleware,
  getDriverRequests
);
router.put(
  "/update-status",
  authMiddleware,
  updateEmergencyStatus
);
// Hospital Emergency Route
 router.get(
  "/hospital",
  authMiddleware,
  getHospitalRequests
);
router.get(
  "/nearest-hospitals/:requestId",
  authMiddleware,
  getNearestHospitals
);
router.put(
  "/assign-hospital",
  authMiddleware,
  assignHospital
);

router.put(
  "/hospital/accept",
  authMiddleware,
  acceptHospitalEmergency
);

router.put(
  "/hospital/reject",
  authMiddleware,
  rejectHospitalEmergency
);
export default router;