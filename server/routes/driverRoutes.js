import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  updateDriverLocation,
    getAvailableDrivers,
} from "../controllers/driverController.js";

const router = express.Router();

router.put(
  "/location",
  authMiddleware,
  updateDriverLocation
);
router.get(
  "/available",
  authMiddleware,
  getAvailableDrivers
);

export default router;