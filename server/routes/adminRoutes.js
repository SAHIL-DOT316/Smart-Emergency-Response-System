import express from "express";
import {
  addDriver,
  getAllDrivers,
   getDriverById,
   updateDriver,
    deleteDriver,
} from "../controllers/adminController.js";


import {
  addHospital,
  getAllHospitals,
  getHospitalById,
  updateHospital,
  deleteHospital,
} from "../controllers/adminController.js";
import{
   updateAdminProfile,
  changeAdminPassword,
  getDashboardStats,
} from "../controllers/adminController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/drivers", addDriver);
router.get("/drivers", getAllDrivers);
router.get("/drivers/:id", getDriverById);
router.put("/drivers/:id", updateDriver);
router.delete("/drivers/:id", deleteDriver);


router.post("/hospitals", addHospital);
router.get("/hospitals", getAllHospitals);
router.get("/hospitals/:id", getHospitalById);
router.put("/hospitals/:id", updateHospital);
router.delete("/hospitals/:id", deleteHospital);


// Admin Profile
router.put("/profile", authMiddleware, updateAdminProfile);

router.put("/change-password", authMiddleware, changeAdminPassword);

router.get("/dashboard", authMiddleware, getDashboardStats);
export default router;