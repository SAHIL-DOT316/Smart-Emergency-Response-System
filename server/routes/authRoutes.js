import express from "express";
import { registerPatient ,loginPatient,  loginAdmin, } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerPatient);
router.post("/login", loginPatient);
router.post("/admin/login", loginAdmin);
export default router;