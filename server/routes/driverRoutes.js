import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  updateDriverLocation,
} from "../controllers/driverController.js";

const router = express.Router();

router.put(
  "/location",
  authMiddleware,
  updateDriverLocation
);

export default router;