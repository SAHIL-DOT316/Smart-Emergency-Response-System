import EmergencyRequest from "../models/EmergencyRequest.js";
import Hospital from "../models/Hospital.js";
import Driver from "../models/Driver.js";
import { calculateDistance } from "../utils/distance.js";
import { sendEmergencyToDriver } from "../socket/socketManager.js";

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

    
    const drivers = await Driver.find({
      status: "available",
      latitude: { $ne: null },
      longitude: { $ne: null },
    }).select(
      "fullName phone ambulanceNumber latitude longitude status"
    );

    

    if (drivers.length === 0) {
      return res.status(201).json({
        success: true,
        message:
          "Emergency request created. No ambulance is currently available.",
        emergency,
      });
    }

    

    const driversWithDistance = drivers.map(
      (driver) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          driver.latitude,
          driver.longitude
        );

        return {
          ...driver.toObject(),
          distance,
        };
      }
    );

    // ==========================================
    // SORT NEAREST FIRST
    // ==========================================

    driversWithDistance.sort(
      (a, b) => a.distance - b.distance
    );

    

    const nearestDriver =
      driversWithDistance[0];

    // ==========================================
    // ASSIGN DRIVER
    // ==========================================

    emergency.driver =
      nearestDriver._id;

    emergency.status = "Accepted";

    await emergency.save();

    // ==========================================
    // MAKE DRIVER BUSY
    // ==========================================

    await Driver.findByIdAndUpdate(
      nearestDriver._id,
      {
        status: "busy",
      }
    );

    // ==========================================
    // SEND SOCKET NOTIFICATION
    // ==========================================

    const io = req.app.get("io");

    let notificationSent = false;

    if (io) {
      notificationSent =
        sendEmergencyToDriver(
          io,
          nearestDriver._id,
          {
            requestId: emergency._id,
            emergencyType:
              emergency.emergencyType,
            pickupAddress:
              emergency.pickupAddress,
            latitude:
              emergency.latitude,
            longitude:
              emergency.longitude,
            distance: Number(
              nearestDriver.distance.toFixed(2)
            ),
            patient: req.user.id,
          }
        );
    }

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(201).json({
      success: true,

      message: notificationSent
        ? "Emergency created and nearest ambulance assigned."
        : "Emergency created and ambulance assigned, but driver is currently offline.",

      emergency,

      driver: {
        _id: nearestDriver._id,
        fullName: nearestDriver.fullName,
        phone: nearestDriver.phone,
        ambulanceNumber:
          nearestDriver.ambulanceNumber,
        distance: Number(
          nearestDriver.distance.toFixed(2)
        ),
        online: notificationSent,
      },
    });

  } catch (error) {
    console.error(
      "Create Emergency Error:",
      error
    );

    return res.status(500).json({
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
  latitude: { $ne: null },
  longitude: { $ne: null },
}).select(
  "fullName phone ambulanceNumber latitude longitude status"
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

    const emergency =
      await EmergencyRequest.findById(requestId);

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: "Emergency request not found",
      });
    }

    if (emergency.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message:
          "Nearest ambulances can only be found for pending requests",
      });
    }

    const drivers = await Driver.find({
      status: "available",
      latitude: { $ne: null },
      longitude: { $ne: null },
    }).select(
      "fullName phone ambulanceNumber latitude longitude status"
    );

    const driversWithDistance = drivers.map((driver) => {
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
    });

    driversWithDistance.sort(
      (a, b) => a.distance - b.distance
    );

    // Return nearest 5
    const nearestDrivers =
      driversWithDistance.slice(0, 5);

    res.status(200).json({
      success: true,
      requestId,
      count: nearestDrivers.length,
      drivers: nearestDrivers,
    });

  } catch (error) {
    console.error(
      "Get nearest drivers error:",
      error
    );

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
     if (emergency.driver) {
  return res.status(400).json({
    success: false,
    message: "Driver is already assigned to this request",
  });
}

if (emergency.status !== "Pending") {
  return res.status(400).json({
    success: false,
    message: "Emergency request is not pending",
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

// Hospital Emergency service

// Get nearest hospitals with available emergency beds
export const getNearestHospitals = async (req, res) => {
  try {
    const { requestId } = req.params;

    // Find emergency request
    const emergency = await EmergencyRequest.findById(requestId);

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: "Emergency request not found",
      });
    }

    // Find hospitals having:
    // 1. location
    // 2. available emergency beds
    const hospitals = await Hospital.find({
  latitude: { $ne: null },
  longitude: { $ne: null },
  locationSet: true,
  status: "online",
  emergencyBeds: { $gt: 0 },
  availableBeds: { $gt: 0 },
}).select(
  "hospitalName phone email address city latitude longitude emergencyBeds availableBeds status"
);

    // Calculate distance
    const hospitalsWithDistance = hospitals.map(
      (hospital) => {
        const distance = calculateDistance(
          emergency.latitude,
          emergency.longitude,
          hospital.latitude,
          hospital.longitude
        );

        return {
          ...hospital.toObject(),
          distance: Number(distance.toFixed(2)),
        };
      }
    );

    // Nearest hospital first
    hospitalsWithDistance.sort(
      (a, b) => a.distance - b.distance
    );

    // Return nearest 5 hospitals
    const nearestHospitals =
      hospitalsWithDistance.slice(0, 5);

    return res.status(200).json({
      success: true,
      requestId,
      count: nearestHospitals.length,
      hospitals: nearestHospitals,
    });

  } catch (error) {
    console.error(
      "Get nearest hospitals error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET HOSPITAL EMERGENCY REQUESTS
// ==========================================

export const getHospitalRequests = async (req, res) => {
  try {
    const hospitalId = req.user.id;

    const requests = await EmergencyRequest.find({
      hospital: hospitalId,
      status: {
        $in: [
          "Hospital Assigned",
          "Hospital Accepted",
          "Patient Arrived",
        ],
      },
    })
      .populate(
        "patient",
        "fullName phone email"
      )
      .populate(
        "driver",
        "fullName phone ambulanceNumber"
      )
      .populate(
        "hospital",
        "hospitalName phone city availableBeds"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });

  } catch (error) {
    console.error(
      "Get Hospital Requests Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
 export const acceptHospitalEmergency = async (req, res) => {
  try {
    const hospitalId = req.user.id;
    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: "Request ID is required",
      });
    }

    const emergency =
      await EmergencyRequest.findById(requestId);

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: "Emergency request not found",
      });
    }

    // Make sure this request belongs to this hospital
    if (
      !emergency.hospital ||
      emergency.hospital.toString() !== hospitalId
    ) {
      return res.status(403).json({
        success: false,
        message: "This emergency is not assigned to your hospital",
      });
    }

    // Check status
    if (emergency.status !== "Hospital Assigned") {
      return res.status(400).json({
        success: false,
        message: "Emergency cannot be accepted at this stage",
      });
    }

    const hospital =
      await Hospital.findById(hospitalId);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }

    // Check beds
    if (hospital.availableBeds <= 0) {
      return res.status(400).json({
        success: false,
        message: "No emergency beds available",
      });
    }

    // Reserve one bed
    hospital.availableBeds -= 1;

    emergency.status = "Hospital Accepted";

    await hospital.save();
    await emergency.save();

    return res.status(200).json({
      success: true,
      message: "Emergency accepted successfully",
      emergency,
      availableBeds: hospital.availableBeds,
    });

  } catch (error) {
    console.error(
      "Accept Hospital Emergency Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const rejectHospitalEmergency = async (req, res) => {
  try {
    const hospitalId = req.user.id;
    const { requestId } = req.body;

    const emergency =
      await EmergencyRequest.findById(requestId);

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: "Emergency request not found",
      });
    }

    if (
      !emergency.hospital ||
      emergency.hospital.toString() !== hospitalId
    ) {
      return res.status(403).json({
        success: false,
        message: "This emergency is not assigned to your hospital",
      });
    }

    if (emergency.status !== "Hospital Assigned") {
      return res.status(400).json({
        success: false,
        message: "Emergency cannot be rejected now",
      });
    }

    // Remove hospital
    emergency.hospital = null;

    emergency.status = "Accepted";

    await emergency.save();

    return res.status(200).json({
      success: true,
      message: "Hospital rejected the emergency",
      emergency,
    });

  } catch (error) {
    console.error(
      "Reject Hospital Emergency Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const assignHospital = async (req, res) => {
  try {
    const { requestId, hospitalId } = req.body;

    if (!requestId || !hospitalId) {
      return res.status(400).json({
        success: false,
        message: "Request ID and Hospital ID are required",
      });
    }

    const emergency =
      await EmergencyRequest.findById(requestId);

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: "Emergency request not found",
      });
    }

    if (emergency.hospital) {
      return res.status(400).json({
        success: false,
        message: "Hospital already assigned",
      });
    }

    const hospital =
      await Hospital.findById(hospitalId);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }

    // Hospital must be online
    if (hospital.status !== "online") {
      return res.status(400).json({
        success: false,
        message: "Hospital is currently offline",
      });
    }

    // Hospital must have location
    if (
      hospital.locationSet !== true ||
      hospital.latitude === null ||
      hospital.longitude === null
    ) {
      return res.status(400).json({
        success: false,
        message: "Hospital location is not available",
      });
    }

    // Hospital must have available bed
    if (hospital.availableBeds <= 0) {
      return res.status(400).json({
        success: false,
        message: "Hospital has no available emergency beds",
      });
    }

    emergency.hospital = hospital._id;
    emergency.status = "Hospital Assigned";

    await emergency.save();

    return res.status(200).json({
      success: true,
      message: "Hospital assigned successfully",
      emergency,
    });

  } catch (error) {
    console.error(
      "Assign Hospital Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};