import express from "express";
import { registerPatient ,loginPatient,  loginAdmin,  loginDriver,} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerPatient);
router.post("/login", loginPatient);
router.post("/admin/login", loginAdmin);
router.post("/driver/login", loginDriver);
export default router;