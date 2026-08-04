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

export default router;