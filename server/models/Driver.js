import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    ambulanceNumber: {
      type: String,
      required: true,
      unique: true,
    },

    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ["available", "busy", "offline"],
      default: "offline",
    },

    role: {
      type: String,
      default: "driver",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Driver", driverSchema);