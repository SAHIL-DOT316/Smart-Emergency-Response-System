import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import emergencyRoutes from "./routes/emergencyRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";

import authMiddleware from "./middleware/authMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/api/patient/profile", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected Route Accessed",
    user: req.user,
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/hospital", hospitalRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Smart Emergency Backend Running",
  });
});

export default app;