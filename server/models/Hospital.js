import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    hospitalName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    emergencyBeds: {
      type: Number,
      default: 0,
    },

    availableBeds: {
      type: Number,
      default: 0,
    },

    // Hospital GPS location
    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },

    // Has hospital set its location?
    locationSet: {
      type: Boolean,
      default: false,
    },
    status: {
  type: String,
  enum: ["online", "offline"],
  default: "offline",
},

    role: {
      type: String,
      default: "hospital",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Hospital", hospitalSchema);