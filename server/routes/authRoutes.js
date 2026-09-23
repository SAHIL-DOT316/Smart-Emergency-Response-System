import express from "express";
import {
  registerPatient,
  loginPatient,
  loginAdmin,
  loginDriver,
  logoutDriver,
  loginHospital,
  getPatientProfile,
  updatePatientProfile,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", registerPatient);
router.post("/login", loginPatient);
router.post("/admin/login", loginAdmin);
router.post("/driver/login", loginDriver);
router.post("/hospital/login", loginHospital);
router.put(
  "/driver/logout",
  authMiddleware,
  logoutDriver
);

router.get(
  "/patient/profile",
  authMiddleware,
  getPatientProfile
);

router.put(
  "/patient/profile",
  authMiddleware,
  updatePatientProfile
);
export default router;