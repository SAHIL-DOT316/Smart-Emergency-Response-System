import EmergencyRequest from "../models/EmergencyRequest.js";
import Driver from "../models/Driver.js";
import { calculateDistance } from "../utils/distance.js";

export const createEmergencyRequest = async (req, res) => {
  try {
    const {
      pickupAddress,
      latitude,
      longitude,
      emergencyType,
    } = req.body;

    if (
      !pickupAddress ||
      latitude === undefined ||
      longitude === undefined ||
      !emergencyType
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const emergency = await EmergencyRequest.create({
      patient: req.user.id,
      pickupAddress,
      latitude,
      longitude,
      emergencyType,
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Emergency request created successfully",
      emergency,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get my emergency request

export const getMyEmergencyRequests = async (req, res) => {
  try {
    const requests = await EmergencyRequest.find({
      patient: req.user.id
    })
      .populate(
        "driver",
        "fullName phone ambulanceNumber"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requests
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Get Available Ambulances
export const getAvailableDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({
      status: "available",
    }).select(
      "fullName phone ambulanceNumber status"
    );

    res.status(200).json({
      success: true,
      count: drivers.length,
      drivers,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get nearest available ambulances

export const getNearestDrivers = async (req, res) => {
  try {
    const { requestId } = req.params;

    const emergency = await EmergencyRequest.findById(
      requestId
    );

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: "Emergency request not found",
      });
    }

    const drivers = await Driver.find({
      status: "available",
      latitude: { $ne: null },
      longitude: { $ne: null },
    }).select(
      "fullName phone ambulanceNumber latitude longitude status"
    );

    const driversWithDistance = drivers.map(
      (driver) => {

        const distance = calculateDistance(
          emergency.latitude,
          emergency.longitude,
          driver.latitude,
          driver.longitude
        );

        return {
          ...driver.toObject(),
          distance: Number(distance.toFixed(2)),
        };
      }
    );

    // Nearest driver first
    driversWithDistance.sort(
      (a, b) => a.distance - b.distance
    );

    res.status(200).json({
      success: true,
      requestId,
      count: driversWithDistance.length,
      drivers: driversWithDistance,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get All Emergency Requests (Admin)

export const getAllEmergencyRequests = async (req, res) => {
  try {
    const requests = await EmergencyRequest.find()
      .populate("patient", "fullName phone email")
      .populate("driver", "fullName phone")
      .populate("hospital", "hospitalName city")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



//Driver assign api
export const assignDriver = async (req, res) => {
  try {
    const { requestId, driverId } = req.body;

    if (!requestId || !driverId) {
      return res.status(400).json({
        success: false,
        message: "Request ID and Driver ID are required",
      });
    }

    const emergency = await EmergencyRequest.findById(requestId);

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: "Emergency request not found",
      });
    }

    const driver = await Driver.findById(driverId);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    if (driver.status !== "available") {
      return res.status(400).json({
        success: false,
        message: "Driver is not available",
      });
    }

    emergency.driver = driver._id;
    emergency.status = "Accepted";

    driver.status = "busy";

    await emergency.save();
    await driver.save();

    res.status(200).json({
      success: true,
      message: "Driver assigned successfully",
      emergency,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get Driver Assigned Request
export const getDriverRequests = async (req, res) => {
  try {
    const driverId = req.user.id;

    const requests = await EmergencyRequest.find({
      driver: driverId,
    })
      .populate("patient", "fullName phone")
      .populate("hospital", "hospitalName city")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//status update  controller

export const updateEmergencyStatus = async (req, res) => {
  try {
    const { requestId, status } = req.body;

    const emergency = await EmergencyRequest.findById(requestId);

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: "Emergency request not found",
      });
    }

    emergency.status = status;

    await emergency.save();

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      emergency,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};