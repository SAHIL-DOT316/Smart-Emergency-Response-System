import express from "express";
import {
  addDriver,
  getAllDrivers,
   getDriverById,
   updateDriver,
    deleteDriver,
} from "../controllers/adminController.js";

const router = express.Router();


router.post("/drivers", addDriver);
router.get("/drivers", getAllDrivers);
router.get("/drivers/:id", getDriverById);
router.put("/drivers/:id", updateDriver);
router.delete("/drivers/:id", deleteDriver);
export default router;