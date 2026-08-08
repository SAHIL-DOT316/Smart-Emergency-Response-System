import express from "express";
import { registerPatient ,loginPatient,  loginAdmin,  loginDriver, logoutDriver,} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", registerPatient);
router.post("/login", loginPatient);
router.post("/admin/login", loginAdmin);
router.post("/driver/login", loginDriver);
router.put(
  "/driver/logout",
  authMiddleware,
  logoutDriver
);
export default router;